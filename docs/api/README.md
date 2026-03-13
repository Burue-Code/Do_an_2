# Thiết kế API – Hệ thống gợi ý phim

Thư mục `docs/api/` chứa tài liệu thiết kế API REST cho toàn bộ hệ thống, dựa trên:

- Use Case: `docs/resources/use_case.plantuml`
- SRS: `docs/resources/srs.md`
- ERD: `docs/resources/erd.plantuml`
- Tech stack: `docs/resources/tech_stack.md`

---

## 1. Chuẩn API

- **Phong cách**: RESTful, JSON.
- **Base URL** (tham khảo):
  - Backend: `https://api.example.com`
  - Dev (local): `http://localhost:8080`
- **Prefix chung**:
  - Public API: `/api/...`
  - Khu vực admin: `/api/admin/...`
- **Bảo mật**:
  - Sử dụng **JWT Bearer Token** hoặc **HttpOnly Cookie** theo thiết kế backend (Spring Security).
  - Các route `/api/admin/**` yêu cầu role `ADMIN`.
- **Định dạng trả về**:
  - Dùng DTO, bao gói trong dạng:
    ```json
    {
      "success": true,
      "message": "string",
      "data": { ... },
      "errors": null
    }
    ```

---

## 2. Nhóm API chính

Các nhóm dưới đây tương ứng với module backend đã thiết kế trong `project_structure.md`.

- **Auth** (`/api/auth/...`)
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `POST /api/auth/refresh`
  - `POST /api/auth/change-password`
  - `GET  /api/auth/me`

- **User & Profile** (`/api/users/...`)
  - `GET  /api/users/me`
  - `PUT  /api/users/me`
  - `PUT  /api/users/me/favorite-genres`
  - `GET  /api/admin/users`
  - `GET  /api/admin/users/{id}`
  - `PATCH /api/admin/users/{id}/lock`
  - `PATCH /api/admin/users/{id}/unlock`
  - `DELETE /api/admin/users/{id}`

- **Genre** (`/api/genres/...`)
  - `GET    /api/genres`
  - `GET    /api/genres/{id}`
  - `POST   /api/admin/genres`
  - `PUT    /api/admin/genres/{id}`
  - `DELETE /api/admin/genres/{id}`

- **Movie & Episode & Schedule** (`/api/movies/...`, `/api/episodes/...`, `/api/schedules/...`)
  - Danh sách phim, chi tiết phim, phim theo thể loại, top, high-rated, now-showing, completed, single.
  - CRUD phim, phân trang, gán thể loại cho phim.
  - Danh sách tập phim cho phim bộ, CRUD tập phim.
  - Lịch chiếu / lịch đăng phim, CRUD lịch chiếu.

- **Comment / Rating / Like / Watchlist / Watch History**
  - Bình luận phim: list, thêm, sửa, xóa.
  - Đánh giá phim: tạo/cập nhật rating, xem summary rating.
  - Like phim: toggle like, xem danh sách phim đã like.
  - Watchlist: toggle lưu/ bỏ lưu phim, danh sách phim theo dõi của user.
  - Watch history: lưu lịch sử xem, tiếp tục xem, danh sách lịch sử xem, xóa record.

- **Search & Recommendation**
  - Search: tìm kiếm phim theo từ khóa, gợi ý từ khóa, lịch sử tìm kiếm của user.
  - Recommendation: gợi ý phim cá nhân hóa (`/api/recommendations/me`), gợi ý cho trang home (`/api/recommendations/home`).

- **Admin Dashboard**
  - Thống kê tổng quan: số user, số movie, số comment...
  - Danh sách phim trending, top genres, dữ liệu phục vụ dashboard.

---

## 3. File OpenAPI

- **`openapi.yaml`** là tài liệu chuẩn mô tả:
  - Thông tin server (dev/prod).
  - Toàn bộ path, method, request body, response, status code, schema.
  - Các schema chung: `User`, `Movie`, `Genre`, `Comment`, `Rating`, `WatchlistItem`, `WatchLog`, `RecommendationItem`, `PageResponse`, `ErrorResponse`, v.v.

Khi cập nhật hoặc thêm API mới, hãy:

1. Thêm/điều chỉnh endpoint trong `openapi.yaml`.
2. Đảm bảo tên DTO trong code backend trùng/khớp với schema tương ứng.
3. Cập nhật tài liệu liên quan trong `docs/resources/srs.md` và `docs/resources/project_structure.md` nếu phạm vi chức năng thay đổi.

