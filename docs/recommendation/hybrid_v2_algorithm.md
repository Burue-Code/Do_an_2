# Thuật toán gợi ý – Phiên bản Hybrid V2

Tài liệu này mô tả **thuật toán gợi ý hiện tại** của hệ thống (đã triển khai trong code), sử dụng mô hình **Hybrid Recommendation**:

- **Content‑Based Filtering (CBF)** theo **thể loại phim (genre)** + **time‑decay** theo thời gian hành vi.
- **Collaborative Filtering (CF)** sử dụng **likes** và **lịch sử xem (watch_logs)** của **người dùng khác**.
- Điểm cuối cùng là **tổ hợp tuyến tính** giữa hai nhánh.

Áp dụng chủ yếu trong:

- `RecommendationServiceImpl#getRecommendationsForUser(userId, limit)`
- `RecommendationServiceImpl#getHomeRecommendations(userIdOrNull, limit)`

---

## 1. Mục tiêu và yêu cầu

### 1.1. Mục tiêu

- Gợi ý danh sách phim **phù hợp với từng người dùng**.
- **Bám sát sở thích hiện tại**, ưu tiên hành vi **mới** hơn hành vi cũ.
- Khai thác **hành vi của những người dùng khác có gu tương tự**.
- Có **fallback ổn định** khi dữ liệu ít (user mới, ít tương tác).

### 1.2. Dữ liệu sử dụng

Thuật toán sử dụng các bảng chính trong schema:

- `users`: thông tin người dùng.
- `movies`: thông tin phim, bao gồm:
  - `rating_score`
  - `rating_count`
  - `movie_type`, `status`, `created_at`...
- `genres`, `movies_genre`: danh sách thể loại và liên kết phim–thể loại.
- `likes` (entity `MovieLike`):
  - Lượt thích phim, có `user_id`, `movie_id`, `created_at`.
- `watch_logs` (entity `WatchLog`):
  - Lịch sử xem, có `user_id`, `movie_id`, `completed`, `last_watched_at`...

Giới hạn để đảm bảo hiệu năng:

- `MAX_WATCHED_TO_ANALYSE = 80`: tối đa 80 bản ghi `watch_logs` gần nhất cho mỗi user.
- `MAX_LIKES_TO_ANALYSE = 80`: tối đa 80 lượt `likes` gần nhất.
- `MAX_GENRES_TO_USE = 5`: tối đa 5 thể loại ưu tiên.
- `MAX_SIMILAR_USERS = 25`: tối đa 25 người dùng tương tự cho CF.

---

## 2. Bước 1 – Xây hồ sơ sở thích (Content‑Based + Time‑Decay)

### 2.1. Thu thập hành vi của user hiện tại

Đầu vào: `userId`, `limit`.

1. **Likes gần đây**
   - Query: `MovieLikeRepository.findById_UserId(userId)`
   - Sắp xếp theo `created_at` từ mới đến cũ, giới hạn `MAX_LIKES_TO_ANALYSE`.

2. **Watch logs gần đây**
   - Query: `WatchLogRepository.findByUser_IdOrderByLastWatchedAtDesc(userId, PageRequest.of(0, MAX_WATCHED_TO_ANALYSE))`

3. **Tập phim đã biết (exclude)**
   - `excludeMovieIds = { movieId từ likes } ∪ { movieId từ watch_logs }`
   - Dùng để **không gợi ý lại** phim người dùng đã xem/like.

### 2.2. Time‑decay cho từng hành vi

Để ưu tiên hành vi gần đây, thuật toán dùng **hàm mũ suy giảm theo ngày**:

```text
DECAY_LAMBDA_PER_DAY = ln(2) / 14       // half-life ≈ 14 ngày
LIKE_BASE_WEIGHT    = 2.0
WATCH_BASE_WEIGHT   = 1.0
```

Với mỗi hành vi tại thời điểm `eventTime`:

1. Tính số ngày chênh lệch:
   \[
   \Delta days = daysBetween(eventTime, now)
   \]

2. **Trọng số cho lượt like**:
   \[
   w_{\text{like}} = 2.0 \times e^{-\lambda \cdot \Delta days}
   \]

3. **Trọng số cho lượt xem**:
   \[
   w_{\text{watch}} =
   \begin{cases}
   1.0 \times e^{-\lambda \cdot \Delta days} & \text{nếu chưa hoàn thành} \\
   1.0 \times e^{-\lambda \cdot \Delta days} \times 1.2 & \text{nếu } completed = true
   \end{cases}
   \]

Trong đó \(\lambda = \ln(2)/14\). Như vậy:

- Hành vi cách **14 ngày** còn ~50% trọng số.
- Cách **28 ngày** còn ~25% trọng số.

Tổng hợp lại thành bản đồ:

\[
movieWeight[movieId] = \sum w_{\text{like}} + \sum w_{\text{watch}}
\]

Nếu `movieWeight` rỗng → user quá mới, thuật toán sẽ chuyển sang **fallback** (mục 5).  

### 2.3. Từ phim → thể loại yêu thích

1. Lấy tất cả `MovieGenre` có `movie_id` thuộc `movieWeight.keySet()`.
2. Với mỗi bản ghi có `genreId`:
   \[
   genreScore[genreId] += movieWeight[movieId]
   \]
3. Sắp xếp `genreScore` giảm dần, lấy **top `MAX_GENRES_TO_USE`** (tối đa 5) → `preferredGenreIds`.

### 2.4. Chọn danh sách phim Content‑Based

- **Nếu có `preferredGenreIds`**:
  - Gọi `MovieRepository.findRecommendedByGenreIds(preferredGenreIds, excludeMovieIds, pageable)`.
  - Query JPA: chọn phim có genre trong danh sách, **không nằm trong `excludeMovieIds`**, sắp xếp `ratingScore` giảm dần.

- **Nếu không có hành vi (user mới)**:
  - Gọi `findAllByOrderByRatingScoreDesc(PageRequest.of(0, limit * 2))`.
  - Loại các phim trong `excludeMovieIds` (nếu có), lấy `limit` phim đầu.

Danh sách kết quả tạm gọi là `contentMovies`.

### 2.5. Điểm Content‑Based

Điểm CBF cho mỗi phim được gán theo vị trí trong `contentMovies`:

- Phim đầu tiên: `0.95`
- Mỗi phim tiếp theo giảm `0.03`, nhưng không thấp hơn `0.5`:

\[
score_{\text{content}}(m_i) = \max(0.5,\ 0.95 - 0.03 \cdot i)
\]

Hàm triển khai: `buildLinearScores(List<Movie> movies)` trong `RecommendationServiceImpl`.

---

## 3. Bước 2 – Collaborative Filtering (User‑based, likes + watch_logs)

### 3.1. Mục tiêu

Gợi ý các phim mà **người dùng tương tự** đã xem/like nhưng **user hiện tại chưa xem**:

> “Những người có lịch sử xem/like giống bạn thường có gu tương tự.
> Nếu họ xem/like thêm các phim khác, đó là ứng viên tốt để gợi ý.”

### 3.2. Xác định tập phim gốc của user

Sử dụng lại từ bước CBF:

\[
I_u = \{ movieId \mid movieWeight[movieId] > 0 \}
\]

### 3.3. Tìm người dùng tương tự

Từ hai repository:

- `MovieLikeRepository.findTopUserIdsWhoLikedMovies(I_u, pageable)`
- `WatchLogRepository.findTopUserIdsWhoWatchedMovies(I_u, pageable)`

Thu được danh sách `userId` đã like/xem **ít nhất một phim** trong `I_u`, nhóm theo user và sắp xếp theo số lượng bản ghi trùng. Sau đó:

- Gộp hai danh sách.
- Loại bỏ chính `userId` hiện tại.
- Giới hạn tối đa `MAX_SIMILAR_USERS = 25` người dùng.

### 3.4. Độ tương đồng (similarity) giữa 2 user

Với mỗi người dùng tương tự \(v\):

1. Xây `I_v` – tập phim user v đã like/xem gần đây (cũng áp dụng giới hạn 80/80).
2. Tính:

\[
sim(u, v) = \frac{|I_u \cap I_v|}{|I_u \cup I_v|}
\]

(**Jaccard similarity** trên tập phim).

3. Nếu `sim(u,v) = 0` hoặc `I_v` rỗng → bỏ qua user `v`.

### 3.5. Cộng điểm cho phim candidate

Với mỗi user tương tự \(v\) có `sim(u,v) > 0`:

1. Duyệt các phim `v` đã **like** (gần đây, có time‑decay):
   - Nếu `movieId ∉ excludeMovieIds`:
     \[
     candidateScore[movieId] += sim(u,v) \times LIKE\_BASE\_WEIGHT \times decayWeight(createdAt)
     \]

2. Duyệt các phim `v` đã **xem** (gần đây, có time‑decay, có xét `completed`):
   - Nếu `movieId ∉ excludeMovieIds`:
     \[
     candidateScore[movieId] += sim(u,v) \times WATCH\_BASE\_WEIGHT \times decayWeight(lastWatchedAt) \times 1.2^{completed}
     \]

Để tránh “nổ” số lượng, hệ thống giới hạn số phim mà mỗi user tương tự đóng góp (`MAX_MOVIES_PER_SIMILAR_USER`).  

Kết quả: bản đồ `candidateScore[movieId]` – tổng đóng góp từ tất cả user tương tự.

### 3.6. Chuẩn hoá điểm Collaborative

1. Lấy:

\[
max = \max_m candidateScore[m]
\]

2. Chuẩn hoá về \([0,1]\):

\[
score_{\text{collab\_raw}}(m) = \frac{candidateScore[m]}{max}
\]

3. Đưa về khoảng \([0.5, 0.95]\) cho dễ trộn với CBF:

\[
score_{\text{collab}}(m) = 0.5 + 0.45 \times score_{\text{collab\_raw}}(m)
\]

4. Giới hạn số candidate (ví dụ `limit * 3` hoặc 60 phim) để tối ưu truy vấn `movies`.

---

## 4. Bước 3 – Mô hình Hybrid: trộn CBF và CF

Để tận dụng ưu điểm của cả hai nhánh, hệ thống kết hợp điểm như sau:

- Trọng số:
  - `CONTENT_WEIGHT = 0.6`
  - `COLLAB_WEIGHT = 0.4`

- Với mỗi phim \(m\) xuất hiện trong ít nhất một trong hai tập (CBF hoặc CF):

\[
score_{\text{final}}(m) =
0.6 \times score_{\text{content}}(m)
 + 0.4 \times score_{\text{collab}}(m)
\]

Sau đó:

1. Sắp xếp tất cả phim theo `score_final` giảm dần.
2. Bỏ toàn bộ phim trong `excludeMovieIds` (phim user đã xem/like).
3. Lấy **top `limit`** phim.
4. Map sang DTO `RecommendationItemResponse`, giới hạn `score` trong \([0.5, 0.99]\) để hiển thị.

Nếu vì lý do nào đó không có điểm hybrid (vd: không có CBF và/hoặc CF), hệ thống fallback trả về danh sách CBF hoặc trending như mô tả ở phần tiếp theo.

---

## 5. Fallback và trường hợp đặc biệt

### 5.1. User mới (chưa có like/xem)

Khi `movieWeight` rỗng (không có hành vi đủ để tính CBF/CF):

- Thuật toán bỏ qua bước 2 và 3.
- Lấy danh sách phim theo `ratingScore` hoặc `ratingCount` giảm dần.
- Đây là dạng **“gợi ý phổ biến”** (popular items).

### 5.2. Trang Home – người dùng chưa đăng nhập

`RecommendationServiceImpl#getHomeRecommendations(userIdOrNull, limit)`:

- Nếu `userIdOrNull != null` → gọi `getRecommendationsForUser` (dùng Hybrid đầy đủ).
- Nếu `userIdOrNull == null` → gọi `MovieQueryService.getTrending(limit)` (theo `ratingCount`), score cố định `0.8`.

### 5.3. Thiếu dữ liệu Collaborative

Nếu không tìm được người dùng tương tự (`similarUserIds` rỗng) hoặc `candidateScore` rỗng:

- Hệ thống **chỉ dùng Content‑Based** để gợi ý (vẫn có time‑decay và ưu tiên thể loại).

---

## 6. Tóm tắt ngắn gọn cho báo cáo

- **Thuật toán gợi ý của hệ thống** là **Hybrid Recommendation**:
  - **Content‑Based** sử dụng:
    - Thể loại phim (genre) từ bảng `movies_genre`.
    - Hành vi like/xem gần đây, có **time‑decay** (half‑life 14 ngày).
  - **Collaborative Filtering**:
    - Dựa trên likes + lịch sử xem của **người dùng tương tự** (User‑based CF).
    - Độ giống giữa user tính bằng **Jaccard similarity** trên tập phim đã tương tác.
  - **Điểm cuối** = 0.6 × điểm content + 0.4 × điểm collaborative.
  - Loại trừ toàn bộ phim user đã xem/like, trả về Top K phim.

- Khi thiếu dữ liệu (user mới, ít tương tác), hệ thống tự động **fallback** về các danh sách phổ biến (top rating, trending) để vẫn đảm bảo có gợi ý.

Tài liệu này cần được cập nhật khi:

- Thay đổi trọng số (ví dụ 0.5/0.5 thay vì 0.6/0.4).
- Thay đổi hàm time‑decay (thay half‑life 14 ngày thành 7 hoặc 30).
- Bổ sung thêm tín hiệu mới (ví dụ: watchlist, search history, TF‑IDF mô tả phim, embedding, v.v.).

