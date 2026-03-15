# Recommendation scoring – tóm tắt cho AI/dev

Tài liệu này tóm tắt nhanh thiết kế **thuật toán gợi ý rule-based v1** để hỗ trợ AI và dev khi sinh code cho module `recommendation/`.

Chi tiết đầy đủ xem tại: `docs/recommendation/scoring_v1_rule_based.md`.

---

## 1. Thành phần điểm và trọng số

Mỗi phim candidate \( m \) được chấm 5 thành phần, đã chuẩn hóa về \([0, 1]\):

- `genre_match_score` \( g(m) \): mức độ trùng giữa `users_genre` và `movies_genre` (Jaccard).
- `watch_history_score` \( h(m) \): phim có genre trùng với các phim user xem gần đây (từ `watch_logs`).
- `like_score` \( l(m) \): độ phổ biến theo lượt like (v1: normalized global likes).
- `rating_score` \( r(m) \): kết hợp avg rating và rating count (v1: 70% avg, 30% log(count)).
- `trending_score` \( t(m) \): normalized lượt xem gần đây trong `watch_logs` toàn hệ thống.

Trọng số mặc định:

- \( w_g = 0.40 \)
- \( w_h = 0.25 \)
- \( w_l = 0.20 \)
- \( w_r = 0.10 \)
- \( w_t = 0.05 \)

Điểm tổng:

\[
  \text{score}(m) =
    w_g' \cdot g(m) +
    w_h' \cdot h(m) +
    w_l' \cdot l(m) +
    w_r' \cdot r(m) +
    w_t' \cdot t(m)
\]

Trong đó \( w_*' \) là trọng số đã được **re-normalize** nếu một số thành phần không khả dụng.

---

## 2. Cách tính từng thành phần (tóm tắt)

- **Genre match**:
  - \( G_U \): tập genre user thích (`users_genre`).
  - \( G_m \): tập genre của phim (`movies_genre`).
  - \( g(m) = |G_U \cap G_m| / |G_U \cup G_m| \), hoặc 0 nếu một trong hai rỗng.

- **Watch history** (window gợi ý: 30 ngày):
  - Tạo phân phối `freqGenre[g]` từ `watch_logs` của user.
  - \( h(m) = \text{avg}(\text{freqGenre}[g]) \) với \( g \in G_m \). Nếu không có log → signal missing.

- **Like**:
  - `likesTotal(m)` từ bảng `likes`.
  - \( l(m) = \text{likesTotal}(m) / \max_{m'} \text{likesTotal}(m') \) (linear, 0 nếu max=0).

- **Rating**:
  - `avgRating(m)` \(\in [1,5]\), `ratingCount(m)`.
  - \( r_{\text{avg}}(m) = (\text{avgRating}(m) - 1) / 4 \).
  - \( r_{\text{count}}(m) = \log(1 + \text{ratingCount}(m)) / \log(1 + \max_{m'} \text{ratingCount}(m')) \) (0 nếu max=0).
  - \( r(m) = 0.7 * r_{\text{avg}}(m) + 0.3 * r_{\text{count}}(m) \).

- **Trending** (window gợi ý: 7–30 ngày):
  - `viewsRecent(m)` từ `watch_logs` toàn hệ thống.
  - \( t(m) = \text{viewsRecent}(m) / \max_{m'} \text{viewsRecent}(m') \) (0 nếu max=0).

---

## 3. Xử lý cold-start và thiếu dữ liệu

- Nếu **một thành phần không tính được** (vd: không có history):
  - Bỏ thành phần đó khỏi công thức.
  - Tính lại trọng số \( w_i' = w_i / \sum w_{\text{available}} \).

- **User hoàn toàn mới** (không có users_genre, watch_logs, likes, ratings user):
  - Chỉ dùng `rating_score` + `trending_score` (top rating + trending).

- **User có users_genre nhưng chưa có history/like/rating**:
  - Dùng `genre_match_score` + `rating_score` + `trending_score`.

---

## 4. Gợi ý implement (pseudo cho RecommendationService)

1. Lấy tập candidate C (phim active, không bị ẩn).
2. Load dữ liệu liên quan cho user + global (users_genre, watch_logs user, watch_logs global, likes, ratings, movies_genre).
3. Tính \( g(m), h(m), l(m), r(m), t(m) \) theo công thức trên.
4. Điều chỉnh trọng số theo data available, tính `score(m)`.
5. Sort candidate theo `score(m)` giảm dần, trả về top N (vd: 20).

