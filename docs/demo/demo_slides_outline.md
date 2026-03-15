## Outline slides demo – Hệ thống gợi ý phim

### 1. Giới thiệu đề tài

- Bối cảnh và vấn đề: nhu cầu cá nhân hóa gợi ý phim.
- Mục tiêu hệ thống:
  - Xem phim trực tuyến.
  - Gợi ý phim theo thể loại yêu thích và hành vi người dùng.
- Công nghệ chính: Spring Boot 3, Java 21, MySQL, Next.js, React Query.

### 2. Kiến trúc & thiết kế tổng thể

- Mô hình client–server, backend REST API + frontend Next.js.
- Monorepo: `backend/`, `frontend/`, `database/`, `docs/`, `.ai/`.
- Kiến trúc backend feature-first:
  - Các module: `auth`, `user`, `movie`, `genre`, `comment`, `rating`, `like`, `watchlist`, `watchhistory`, `recommendation`, `admin/dashboard`, `actor`, `director`, `schedule`.
- Cơ sở dữ liệu:
  - Các bảng chính: `users`, `roles`, `genres`, `movies`, `movies_genre`, `watch_logs`, `likes`, `ratings`, `comments`, `watchlist_items`, v.v.

### 3. Chức năng chính đã triển khai

- Người dùng:
  - Đăng ký, đăng nhập.
  - Xem danh sách phim, chi tiết phim, xem phim.
  - Thích phim, đánh giá, bình luận.
  - Lưu phim theo dõi (watchlist), xem lịch sử và tiếp tục xem.
  - Nhận gợi ý phim phù hợp ở trang `/recommendations`.
- Admin:
  - Quản lý phim, thể loại, người dùng, diễn viên, đạo diễn, lịch chiếu (theo phạm vi đã làm).
  - Dashboard thống kê tổng quan, trending movies, top genres.

### 4. Thuật toán gợi ý – Recommendation

- Rule-based scoring v1:
  - Sử dụng các thành phần: genre match, watch history, like, rating, trending.
  - Công thức điểm tổng: kết hợp các thành phần sau khi chuẩn hóa.
- Dữ liệu đầu vào:
  - `users_genre`, `watch_logs`, `likes`, `ratings`, `movies`, `movies_genre`.
- Các trường hợp:
  - User có nhiều dữ liệu hành vi.
  - User mới (cold-start) – sử dụng phim phổ biến/top rating.

### 5. Flow demo hệ thống

- Luồng người dùng:
  1. Đăng nhập bằng tài khoản user.
  2. Xem danh sách phim `/movies`, lọc theo thể loại.
  3. Xem chi tiết phim, thực hiện:
     - Like phim.
     - Đánh giá phim.
     - Thêm bình luận.
     - Lưu phim vào watchlist.
  4. Vào `/account/watchlist` xem danh sách phim theo dõi.
  5. Truy cập `/recommendations` để xem danh sách phim được gợi ý.
- Luồng admin:
  1. Đăng nhập bằng tài khoản admin.
  2. Mở `/admin` và các trang quản trị chính (movies, genres, users).
  3. Mở trang thống kê (dashboard) để xem số liệu tổng quan và trending.

### 6. Kiểm thử & chất lượng

- Backend:
  - Unit/service test cho các module chính (auth, movie/genre, tương tác, recommendation, dashboard…).
- Frontend:
  - Manual/UI test cho luồng chính:
    - Auth, xem phim, tương tác, recommendation, admin.
  - Tài liệu test: `ui_test_plan.md`, `ui_test_cases_main_flows.md`, `ui_test_report_phase_6.md`.

### 7. Kết luận & hướng phát triển

- Đạt được:
  - Hệ thống hoạt động đầy đủ các luồng chính, có gợi ý phim theo rule-based.
  - Có kiểm thử backend/frontend và tài liệu chi tiết (SRS, API, DB, test, demo).
- Hướng mở rộng:
  - Nâng cấp thuật toán gợi ý (ML/CF).
  - Tối ưu hiệu năng và UI/UX.
  - Mở rộng tính năng social, đề xuất theo nhóm bạn bè.

