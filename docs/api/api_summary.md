# Tổng hợp API (tóm tắt)

Tài liệu này tóm tắt nhanh các API chính của hệ thống để tiện **demo/báo cáo**.

- **Nguồn chuẩn**: `docs/api/openapi.yaml` (OpenAPI).
- **Prefix**:
  - Public: `/api/...`
  - Admin: `/api/admin/...` (yêu cầu `ROLE_ADMIN`)
- **Auth**: JWT Bearer (`Authorization: Bearer <token>`)
- **Response**: luôn bọc `BaseResponse<T>`: `{ success, data, message }`

---

## 1) Auth (`/api/auth`)

- **POST** `/api/auth/register`: đăng ký
- **POST** `/api/auth/login`: đăng nhập (trả JWT)
- **GET** `/api/auth/me`: lấy thông tin user hiện tại (**Bearer**)
- **POST** `/api/auth/change-password`: đổi mật khẩu (**Bearer**)

---

## 2) User/Profile (`/api/users`, `/api/admin/users`)

- **GET** `/api/users/me`: profile của tôi (**Bearer**)
- **PUT** `/api/users/me`: cập nhật profile (**Bearer**)
- **PUT** `/api/users/me/favorite-genres`: cập nhật thể loại yêu thích (**Bearer**)

Admin:

- **GET** `/api/admin/users`: danh sách user (ADMIN)
- **GET** `/api/admin/users/{id}`: chi tiết user (ADMIN)
- **PATCH** `/api/admin/users/{id}/lock`: khóa user (ADMIN)
- **PATCH** `/api/admin/users/{id}/unlock`: mở khóa user (ADMIN)
- **DELETE** `/api/admin/users/{id}`: xóa user (ADMIN)

---

## 3) Genre (`/api/genres`, `/api/admin/genres`)

- **GET** `/api/genres`: danh sách thể loại
- **GET** `/api/genres/{id}`: chi tiết thể loại

Admin:

- **POST** `/api/admin/genres`: tạo thể loại (ADMIN)
- **PUT** `/api/admin/genres/{id}`: cập nhật thể loại (ADMIN)
- **DELETE** `/api/admin/genres/{id}`: xóa thể loại (ADMIN)

---

## 4) Movies / Episodes / Schedules

Movies (public):

- **GET** `/api/movies`: danh sách phim (page/size/keyword/genreId/movieType/sort)
- **GET** `/api/movies/{id}`: chi tiết phim
- **GET** `/api/movies/top`: top rating
- **GET** `/api/movies/new`: phim mới
- **GET** `/api/movies/trending`: thịnh hành (theo `ratingCount`)
- **GET** `/api/movies/trending/personal`: thịnh hành cá nhân hoá theo genre (**Bearer**, fallback nếu chưa login)
- **GET** `/api/movies/{id}/episodes`: danh sách tập (thường dùng cho phim bộ)
- **GET** `/api/movies/{id}/cast`: diễn viên/đạo diễn

Movies (admin):

- **POST** `/api/admin/movies`: tạo phim (**ADMIN**)  
  - **Hiện tại trả về `movieId`** để frontend điều hướng sang trang chi tiết.
- **PUT** `/api/admin/movies/{id}`: cập nhật phim (ADMIN)
- **DELETE** `/api/admin/movies/{id}`: xóa phim (ADMIN)
- **GET** `/api/admin/movies/{id}/stats`: thống kê tương tác (ADMIN)
- **GET** `/api/admin/movies/{id}/episodes`: danh sách tập (ADMIN)
- **POST** `/api/admin/movies/{id}/episodes`: tạo tập (ADMIN)
- **PUT** `/api/admin/movies/episodes/{episodeId}`: cập nhật tập (ADMIN)
- **DELETE** `/api/admin/movies/episodes/{episodeId}`: xóa tập (ADMIN)
- **GET** `/api/admin/movies/{id}/schedules`: danh sách lịch chiếu (ADMIN)
- **POST** `/api/admin/movies/{id}/schedules`: tạo lịch chiếu (ADMIN)
- **PUT** `/api/admin/movies/schedules/{scheduleId}`: cập nhật lịch chiếu (ADMIN)
- **DELETE** `/api/admin/movies/schedules/{scheduleId}`: xóa lịch chiếu (ADMIN)

Schedules (admin – quản lý tập trung):

- **GET** `/api/admin/schedules`: danh sách lịch chiếu (ADMIN)
- **POST** `/api/admin/schedules`: tạo lịch chiếu (ADMIN, yêu cầu `movieId`)
- **PUT** `/api/admin/schedules/{id}`: cập nhật lịch chiếu (ADMIN)
- **DELETE** `/api/admin/schedules/{id}`: xóa lịch chiếu (ADMIN)

---

## 5) Comments / Reports (Comment)

Comments (public):

- **GET** `/api/movies/{movieId}/comments`: danh sách comment
- **POST** `/api/movies/{movieId}/comments`: tạo comment (**Bearer**)

Reports:

- **POST** `/api/comments/{commentId}/report`: report comment (**Bearer**)

Admin:

- **GET** `/api/admin/comments`: danh sách comment (ADMIN)
- **DELETE** `/api/admin/comments/{id}`: xóa comment (ADMIN)
- **GET** `/api/admin/comments/reports`: report chưa xử lý (ADMIN)
- **GET** `/api/admin/comments/reports/resolved`: report đã xử lý (ADMIN)
- **PUT** `/api/admin/comments/reports/{id}/resolve`: đánh dấu đã xử lý (ADMIN)
- **DELETE** `/api/admin/comments/reports/{id}`: xóa report (ADMIN)

---

## 6) Rating / Like / Watchlist / Watch History

Rating:

- **POST** `/api/movies/{movieId}/ratings`: tạo/cập nhật rating (**Bearer**)

Like:

- **POST** `/api/movies/{movieId}/like/toggle`: toggle like (**Bearer**)

Watchlist:

- **POST** `/api/movies/{movieId}/watchlist/toggle`: toggle watchlist (**Bearer**)
- **GET** `/api/users/me/watchlist`: danh sách watchlist (**Bearer**)

Watch history:

- **POST** `/api/watch-history/logs`: lưu tiến độ xem (**Bearer**)
- **GET** `/api/watch-history/continue-watching`: danh sách tiếp tục xem (**Bearer**)
- **GET** `/api/watch-history`: lịch sử xem (**Bearer**)

---

## 7) Recommendation (`/api/recommendations`)

- **GET** `/api/recommendations/me`: gợi ý cho user hiện tại (**Bearer**)  
  - Thuật toán hiện tại: **Hybrid V2** (CBF + CF + time‑decay).
- **GET** `/api/recommendations/home`: gợi ý cho Home  
  - Login: dùng `/me`  
  - Không login: fallback trending

Tài liệu thuật toán:

- `docs/recommendation/hybrid_v2_algorithm.md`

---

## 8) Admin Dashboard (`/api/admin/dashboard`)

- Các endpoint thống kê tổng quan/trending/genre… phục vụ trang dashboard admin (ADMIN).

---

## Gợi ý sử dụng

- Khi cần thông tin chi tiết request/response/schema, xem `docs/api/openapi.yaml`.
- Khi demo, ưu tiên nhóm:
  - Auth: login/me
  - Movies: list/detail/top/trending
  - Interaction: comment/rating/like/watchlist
  - Recommendation: recommendations/me
  - Admin: movies CRUD + episodes/schedules + dashboard

