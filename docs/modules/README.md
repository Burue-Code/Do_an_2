# Tài liệu theo module backend

Tài liệu này mô tả nhanh các **module backend** chính trong hệ thống, liên kết giữa:

- Use Case (`docs/resources/use_case.plantuml`)
- SRS (`docs/resources/srs.md`)
- ERD (`docs/resources/erd.plantuml`)
- API (`docs/api/openapi.yaml`)
- Tech stack (`docs/resources/tech_stack.md`)

---

## 1. Danh sách module backend

- `auth`: Đăng ký, đăng nhập, đăng xuất, đổi mật khẩu, lấy profile hiện tại.
- `user`: Thông tin tài khoản, cập nhật profile, quản lý user (admin).
- `genre`: Danh sách thể loại, CRUD thể loại, gán thể loại yêu thích cho user.
- `movie`: Danh sách phim, chi tiết phim, top/high-rated/now-showing/completed/single, CRUD phim (admin).
- `episode`: Danh sách tập phim, CRUD tập phim cho phim bộ.
- `schedule`: Lịch chiếu / lịch đăng phim.
- `comment`: Bình luận phim.
- `rating`: Đánh giá phim.
- `like`: Thích / bỏ thích phim.
- `watchlist`: Lưu phim theo dõi.
- `watchhistory`: Lịch sử xem, tiếp tục xem.
- `search`: Tìm kiếm phim, gợi ý từ khóa, lịch sử tìm kiếm.
- `recommendation`: Gợi ý phim cá nhân hóa.
- `admin/dashboard`: Thống kê hệ thống cho admin.
- `actor` / `director`: Diễn viên, đạo diễn và liên kết với phim.

---

## 2. Cấu trúc chuẩn của một module

Mỗi module backend nên tuân theo cấu trúc:

- `controller/`: REST controller (public/admin nếu cần tách).
- `service/`: Interface nghiệp vụ.
- `service/impl/`: Lớp triển khai service.
- `entity/`: Entity JPA tương ứng với bảng trong ERD.
- `repository/`: Interface Spring Data JPA.
- `dto/`: DTO request/response.
- `mapper/`: MapStruct hoặc mapper thủ công.
- `specification/` (nếu có): Điều kiện tìm kiếm động.

Xem chi tiết trong `docs/resources/project_structure.md`.

---

## 3. Mapping Use Case → Module → API → DB

### 3.1. Ví dụ module `watchlist`

- **Use Case**:
  - UC7 – Lưu phim vào danh sách theo dõi.
- **Module backend**:
  - `watchlist/`
    - `WatchlistController`
    - `WatchlistService`, `WatchlistServiceImpl`
    - `WatchlistItem` (entity)
    - `WatchlistRepository`
- **API chính**:
  - `POST /api/movies/{movieId}/watchlist/toggle`
  - `GET  /api/users/me/watchlist`
- **Bảng liên quan**:
  - `watchlist_items` (theo `erd.plantuml` và `schema_mysql.sql`)

### 3.2. Ví dụ module `recommendation`

- **Use Case**:
  - UC13 – Nhận gợi ý phim phù hợp.
- **Module backend**:
  - `recommendation/`
    - `RecommendationController`
    - `RecommendationService`, `RecommendationServiceImpl`
    - `RecommendationScoringService`, `RecommendationFallbackService`
    - Các strategy cụ thể (genre-based, history-based, hybrid...)
- **API chính**:
  - `GET /api/recommendations/me`
  - `GET /api/recommendations/home`
- **Bảng/Module đầu vào**:
  - `users_genre`, `watch_logs`, `likes`, `ratings`, `movies`, `movies_genre`

Các module còn lại có thể mô tả chi tiết tương tự tùy nhu cầu báo cáo.

