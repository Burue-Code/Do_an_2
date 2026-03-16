# Tài liệu module Recommendation

Module **Recommendation** chịu trách nhiệm gợi ý phim phù hợp cho người dùng dựa trên:

- Thể loại yêu thích
- Lịch sử xem
- Lượt thích
- Đánh giá
- Mức độ phổ biến của phim

---

## 1. Phạm vi chức năng

- UC13 – Nhận gợi ý phim phù hợp.
- Một phần UC14 – Tiếp tục xem phim (khi gợi ý phim đang xem dở).
- Các chức năng liên quan trên giao diện:
  - Trang `/recommendations`
  - Khối “gợi ý cho bạn” trên trang chủ (nếu có)

---

## 2. Dữ liệu đầu vào và bảng liên quan

Module sử dụng dữ liệu từ các bảng (theo `erd.plantuml` và `schema_mysql.sql`):

- `users`: thông tin người dùng.
- `genres`: danh sách thể loại.
- `users_genre`: thể loại yêu thích của người dùng.
- `movies`: danh sách phim, điểm rating trung bình, số lượt rating.
- `movies_genre`: liên kết phim – thể loại.
- `watch_logs`: lịch sử và tiến độ xem phim.
- `likes`: lượt thích phim.
- `ratings`: đánh giá phim.

---

## 3. Thuật toán gợi ý (phiên bản 1 – rule-based)

Giai đoạn đầu **không sử dụng ML phức tạp**, mà áp dụng **tính điểm rule-based** theo các thành phần:

- `genre_match_score`: mức độ trùng khớp giữa thể loại phim và `users_genre`.
- `watch_history_score`: ưu tiên phim có liên quan tới những gì người dùng đã xem (cùng thể loại, cùng đạo diễn/diễn viên, phần tiếp theo...).
- `like_score`: ưu tiên phim tương tự các phim đã được like.
- `rating_score`: ưu tiên phim có rating trung bình cao và nhiều lượt đánh giá.
- `trending_score`: ưu tiên phim đang được xem nhiều (dựa trên `watch_logs`).

Chi tiết thiết kế scoring v1 được mô tả trong  
`docs/recommendation/scoring_v1_rule_based.md`.

Tóm tắt công thức tổng quát:

\[
\text{score} =
  0.40 * \text{genre\_match\_score} +
  0.25 * \text{watch\_history\_score} +
  0.20 * \text{like\_score} +
  0.10 * \text{rating\_score} +
  0.05 * \text{trending\_score}
\]

Trong đó mỗi thành phần được chuẩn hóa về \([0, 1]\) trước khi nhân trọng số.

### Fallback (tóm tắt)

- **User rất mới** (không có lịch sử, like, rating):
  - Nếu chưa có `users_genre`: dùng `trending_score` + `rating_score` (phim phổ biến & top rating).
  - Nếu đã có `users_genre`: dùng `genre_match_score` + `rating_score` + `trending_score`.
- **Thiếu dữ liệu cho một thành phần**:
  - Thành phần đó bị bỏ qua và các trọng số còn lại được **chuẩn hóa lại cho tổng = 1**.

---

## 4. Thiết kế backend Recommendation

- **Package**: `recommendation/`
- **Thành phần chính**:
  - `RecommendationController`
  - `RecommendationService`, `RecommendationServiceImpl`
  - `RecommendationScoringService`, `RecommendationScoringServiceImpl`
  - `RecommendationFallbackService`, `RecommendationFallbackServiceImpl`
  - Strategy:
    - `GenreBasedRecommendationStrategy`
    - `HistoryBasedRecommendationStrategy`
    - `PopularMovieFallbackStrategy`
    - `HybridRecommendationStrategy`
- **API chính** (xem thêm `docs/api/openapi.yaml`):
  - `GET /api/recommendations/me` – Gợi ý phim cho người dùng hiện tại.
  - `GET /api/recommendations/home` – Danh sách gợi ý cho trang chủ (kết hợp nhiều block).

---

## 5. Thiết kế frontend Recommendation

- **Route chính**:
  - `/recommendations`: trang hiển thị danh sách phim gợi ý.
- **Feature frontend**:
  - `src/features/recommendation/api.ts`: gọi các endpoint recommendation.
  - `src/features/recommendation/hooks.ts`: hook `useRecommendations`.
  - `src/features/recommendation/types.ts`: kiểu dữ liệu `RecommendationItem`, `RecommendationResponse`.
- **UI**:
  - Tận dụng `components/movie/movie-card.tsx` để hiển thị phim.
  - Hỗ trợ:
    - Loading state (skeleton).
    - Empty state (khi chưa có dữ liệu, hoặc user mới).
    - Error state (lỗi gọi API).

---

## 6. Liên hệ với Use Case và SRS

- Liên kết với:
  - Mục 3.x (Yêu cầu chức năng) trong `srs.md` – phân hệ gợi ý phim.
  - Mục 6 (Use Case) – phân tích UC13 và phụ thuộc UC8 (thể loại yêu thích), UC11 (lịch sử xem), UC6 (thích phim), UC10 (đánh giá phim).
  - Mục 9 (Sequence Diagram) – trình tự nhận gợi ý phim.

Khi thay đổi thuật toán recommendation hoặc thêm tín hiệu mới (ví dụ: watchlist, tương tác nâng cao), cần cập nhật lại tài liệu này và các phần liên quan trong SRS, ERD và API.

