# Thuật toán gợi ý – Scoring v1 (Rule-based)

Tài liệu này mô tả chi tiết **thuật toán scoring v1** cho module Recommendation, phục vụ cho việc triển khai ở các task 10.2 (RecommendationService) và 10.3 (endpoint API).

Mục tiêu:

- Dễ cài đặt với Spring Data JPA, không dùng ML.
- Dựa trên dữ liệu đã có: `users_genre`, `watch_logs`, `likes`, `ratings`, `movies`, `movies_genre`.
- Dễ điều chỉnh trọng số và luật fallback trong tương lai.

---

## 1. Phạm vi và notation

- Gọi:
  - \( U \): user hiện tại.
  - \( C \): tập candidate movies để chấm điểm (ví dụ: phim còn active, không ẩn).
  - \( \text{score}(m) \): điểm gợi ý cuối cùng cho phim \( m \in C \).
- Mỗi thành phần điểm được chuẩn hóa trong \([0, 1]\):
  - \( g(m) \): `genre_match_score`.
  - \( h(m) \): `watch_history_score`.
  - \( l(m) \): `like_score`.
  - \( r(m) \): `rating_score`.
  - \( t(m) \): `trending_score`.

Trọng số mặc định:

\[
  w_g = 0.40,\quad
  w_h = 0.25,\quad
  w_l = 0.20,\quad
  w_r = 0.10,\quad
  w_t = 0.05
\]

Điểm tổng:

\[
  \text{score}(m) =
    w_g' \cdot g(m) +
    w_h' \cdot h(m) +
    w_l' \cdot l(m) +
    w_r' \cdot r(m) +
    w_t' \cdot t(m)
\]

Trong đó \( w_*' \) là trọng số **đã được điều chỉnh** (re-normalize) trong trường hợp một số thành phần không khả dụng (xem mục 6).

---

## 2. Genre match score – \( g(m) \)

### 2.1. Dữ liệu cần thiết

- Tập thể loại yêu thích của user:
  - Từ bảng `users_genre`: \( G_U = \{\text{genreId}\} \).
- Tập thể loại của phim:
  - Từ `movies_genre`: \( G_m = \{\text{genreId}\} \) cho mỗi phim \( m \).

### 2.2. Công thức

- Sử dụng **Jaccard similarity** làm độ tương đồng:

\[
  g(m) =
  \begin{cases}
    0, & \text{nếu } G_U = \varnothing \text{ hoặc } G_m = \varnothing \\[4pt]
    \dfrac{|G_U \cap G_m|}{|G_U \cup G_m|}, & \text{ngược lại}
  \end{cases}
\]

- Giá trị \( g(m) \in [0, 1] \), không cần chuẩn hóa thêm.

---

## 3. Watch history score – \( h(m) \)

### 3.1. Dữ liệu cần thiết

- Bảng `watch_logs` của user \( U \):
  - Dùng **cửa sổ thời gian gần đây** (gợi ý: 30 ngày) để tập trung vào hành vi mới.
  - Từ các log đó, suy ra **phân phối xem theo genre**.

### 3.2. Phân phối xem theo genre

1. Với mỗi log xem \( \text{log} \) của user U, xác định tập genre của phim \( m_{\text{log}} \): \( G_{m_{\text{log}}} \).
2. Đếm số lần xuất hiện mỗi genre:
   - \( \text{countGenre}[g] \) = số log mà phim xem có genre \( g \).
3. Chuẩn hóa thành phân phối:

\[
  \text{freqGenre}[g] =
  \dfrac{\text{countGenre}[g]}{\sum\limits_{g'} \text{countGenre}[g']}
\]

- Nếu user không có log (trong window chọn) → **không tính được \( h(m) \)** (coi là “missing signal”).

### 3.3. Score theo phim

Với mỗi phim \( m \) có tập genre \( G_m \):

\[
  h(m) =
  \begin{cases}
    0, & \text{nếu không có dữ liệu history hoặc } G_m = \varnothing \\[4pt]
    \dfrac{1}{|G_m|} \sum\limits_{g \in G_m} \text{freqGenre}[g], & \text{ngược lại}
  \end{cases}
\]

- Ý nghĩa: phim có nhiều genre mà user xem nhiều gần đây sẽ có \( h(m) \) cao.

---

## 4. Like & rating scores – \( l(m), r(m) \)

### 4.1. Like score – \( l(m) \)

#### Dữ liệu

- Bảng `likes`:
  - Tổng số lượt like của phim \( m \): \( \text{likesTotal}(m) \).
  - Các phim user đã like: tập \( L_U \).

#### Công thức

Ta kết hợp **2 yếu tố**:

1. **Global like popularity**:
   - Lấy max:

\[
  L_{\max} = \max\limits_{m' \in C} \text{likesTotal}(m')
\]

   - Nếu \( L_{\max} = 0 \) (chưa có like) → thành phần này coi là 0.
   - Ngược lại:

\[
  l_{\text{global}}(m) =
  \dfrac{\text{likesTotal}(m)}{L_{\max}}
\]

2. **Genre similarity với phim đã like** (optional, nếu cần):
   - Có thể tái sử dụng cùng công thức Jaccard với tập genre của các phim trong \( L_U \).
   - Để đơn giản ở v1, **có thể bỏ qua** hoặc chỉ ghi chú cho bản nâng cấp.

Trong v1, để tránh phức tạp, có thể dùng:

\[
  l(m) = l_{\text{global}}(m)
\]

### 4.2. Rating score – \( r(m) \)

#### Dữ liệu

- Từ bảng `ratings` (hoặc cột đã tổng hợp ở `movies`):
  - \( \text{avgRating}(m) \in [1, 5] \) (giả định).
  - \( \text{ratingCount}(m) \): số lượt đánh giá.

#### Công thức

Ý tưởng: phim có **điểm cao** và **nhiều lượt đánh giá** sẽ đáng tin cậy hơn.

1. Chuẩn hóa điểm trung bình về \([0, 1]\):

\[
  r_{\text{avg}}(m) = \dfrac{\text{avgRating}(m) - 1}{5 - 1}
\]

2. Chuẩn hóa số lượt đánh giá (dùng log để tránh lệch):

\[
  R_{\max} = \max\limits_{m' \in C} \text{ratingCount}(m')
\]

Nếu \( R_{\max} = 0 \) → thành phần count = 0. Ngược lại:

\[
  r_{\text{count}}(m) =
  \dfrac{\log(1 + \text{ratingCount}(m))}{\log(1 + R_{\max})}
\]

3. Kết hợp 2 phần (tỉ lệ gợi ý: 70% avg, 30% count):

\[
  r(m) = 0.7 \cdot r_{\text{avg}}(m) + 0.3 \cdot r_{\text{count}}(m)
\]

---

## 5. Trending score – \( t(m) \)

### 5.1. Dữ liệu

- Dựa trên `watch_logs` **toàn hệ thống** trong một window thời gian (ví dụ: 7 hoặc 30 ngày).
- Với mỗi phim \( m \):
  - \( \text{viewsRecent}(m) \): số lượt xem (logs) trong window.

### 5.2. Chuẩn hóa

\[
  V_{\max} = \max\limits_{m' \in C} \text{viewsRecent}(m')
\]

Nếu \( V_{\max} = 0 \) (chưa có log trong window) → cho \( t(m) = 0 \) với mọi \( m \). Ngược lại:

\[
  t(m) = \dfrac{\text{viewsRecent}(m)}{V_{\max}}
\]

Có thể áp dụng log tương tự rating nếu phân phối quá lệch; bản v1 dùng linear cho đơn giản.

---

## 6. Kết hợp điểm và xử lý thiếu dữ liệu

### 6.1. Trọng số mặc định

Như đã nêu ở mục 1:

\[
  w_g = 0.40,\quad
  w_h = 0.25,\quad
  w_l = 0.20,\quad
  w_r = 0.10,\quad
  w_t = 0.05
\]

### 6.2. Thiếu dữ liệu cho một số thành phần

Ví dụ, nếu không tính được \( h(m) \) (user không có history trong window) thì:

- Xem \( h(m) \) là **missing**, KHÔNG gán 0 trực tiếp để tránh phạt bất công.
- Tạo tập các trọng số khả dụng:
  - \( W = \{w_i \mid \text{thành phần } i \text{ khả dụng}\} \).
  - Tính tổng \( S = \sum W \).
  - Trọng số sau khi chuẩn hóa:

\[
  w_i' = \dfrac{w_i}{S}
\]

- Công thức cuối:

\[
  \text{score}(m) = \sum\limits_{i \in \text{available}} w_i' \cdot s_i(m)
\]

Trong đó \( s_i(m) \in \{g(m), h(m), l(m), r(m), t(m)\} \).

### 6.3. Cold-start cho user mới

#### Trường hợp A – User hoàn toàn mới

- Không có `users_genre`, `watch_logs`, `likes`, `ratings` cho user U:
  - Bỏ các thành phần: \( g, h, l \).
  - Dùng:

\[
  \text{score}(m) =
    w_r' \cdot r(m) +
    w_t' \cdot t(m)
\]

  - Đây chính là **top rating + trending**.

#### Trường hợp B – Có `users_genre` nhưng chưa có history/like/rating

- Tính được \( g(m) \), nhưng không có \( h, l \), rating của user.
- Vẫn có thể dùng rating và trending global của phim:

\[
  \text{score}(m) =
    w_g' \cdot g(m) +
    w_r' \cdot r(m) +
    w_t' \cdot t(m)
\]

Trong cả hai trường hợp, việc normalize \( w_i' \) thực hiện như mục 6.2.

---

## 7. Pipeline gợi ý (cho RecommendationService)

Mục này chỉ phác pseudo-code để định hướng cho task 10.2, không ràng buộc implementation chi tiết.

### 7.1. Bước 1 – Lấy candidate

- Input: userId, limit N (ví dụ 20).
- Lấy danh sách phim **đủ điều kiện**:
  - `status` active, chưa bị ẩn.
  - Có thể loại bỏ phim mà user đã xem **hoàn tất** rất lâu, hoặc đã xem quá nhiều lần (tuỳ thực tế).

### 7.2. Bước 2 – Tải dữ liệu hỗ trợ

- Từ các module khác:
  - `users_genre` cho user.
  - `watch_logs` của user (v1: 30 ngày gần nhất).
  - `likes` (toàn hệ thống + user).
  - `ratings` (toàn hệ thống).
  - `watch_logs` toàn hệ thống cho trending (window 7–30 ngày).
  - `movies_genre` cho toàn bộ candidate.

### 7.3. Bước 3 – Tính từng thành phần score

- Áp dụng các công thức ở mục 2–5 để có:
  - \( g(m), h(m), l(m), r(m), t(m) \) cho mọi \( m \in C \) (trong phạm vi dữ liệu cho phép).

### 7.4. Bước 4 – Tổng hợp và sort

- Áp dụng trọng số và re-normalize (mục 6) để tính `score(m)`.
- Sort dãy candidate theo `score(m)` giảm dần.
- Trả về top N (hoặc phân trang tuỳ thiết kế endpoint).

---

## 8. Ví dụ minh họa (đơn giản)

Giả sử:

- User U có `users_genre = {Action, Sci-Fi}`.
- Có 2 phim candidate:
  - \( m_1 \): genre {Action, Sci-Fi}, avgRating = 4.5, ratingCount = 100, viewsRecent = 500, likesTotal = 200.
  - \( m_2 \): genre {Romance}, avgRating = 4.8, ratingCount = 30, viewsRecent = 300, likesTotal = 80.
- Giả sử không dùng history (user mới), nhưng có rating & trending.

Kết quả (theo công thức trên, tính toán chi tiết có thể làm riêng khi cần):

- \( g(m_1) \approx 1.0 \), \( g(m_2) \approx 0 \).
- \( r(m_1), r(m_2) \in [0,1] \) – cả hai đều khá cao nhưng \( m_2 \) có avg rating tốt hơn, m1 có ratingCount lớn hơn.
- \( t(m_1) > t(m_2) \) do viewsRecent cao hơn.
- Sau khi gộp, thông thường \( \text{score}(m_1) \) sẽ cao hơn do kết hợp **genre match + rating + trending**.

Ví dụ này chủ yếu để dev/QA kiểm tra sanity khi implement.

---

## 9. Ghi chú mở rộng cho phiên bản sau

- Có thể bổ sung thêm tín hiệu:
  - Watchlist, thời gian xem trung bình, skip/abandon rate, v.v.
- Có thể chuyển dần sang:
  - Matrix factorization hoặc embedding-based, nhưng vẫn giữ rule-based như baseline/fallback.
- Khi thay đổi trọng số hoặc thuật toán:
  - Cần cập nhật lại tài liệu này, `docs/recommendation/README.md` và phần liên quan trong SRS nếu ảnh hưởng tới behavior người dùng.

