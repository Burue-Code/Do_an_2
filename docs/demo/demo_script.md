## Kịch bản demo – Hệ thống gợi ý phim theo thể loại

> Mục tiêu: Trình bày trong 5–10 phút toàn bộ luồng chính của hệ thống, nhấn mạnh tính cá nhân hóa và khả năng quản trị.

### 1. Mở đầu (1 phút)

- Giới thiệu ngắn:
  - Tên đề tài, thành viên nhóm, vai trò (PM/BA, Backend, Frontend).
  - Mục tiêu: giúp người dùng tìm và xem phim yêu thích, đồng thời gợi ý phim phù hợp dựa trên thể loại và hành vi.

### 2. Kiến trúc & công nghệ (1–2 phút)

- Mở slide kiến trúc:
  - Backend: Spring Boot 3, Java 21, JPA/Hibernate, Flyway, JWT.
  - Frontend: Next.js App Router, TypeScript, React Query, axios.
  - DB: MySQL 8, thiết kế theo ERD với các bảng phim, thể loại, lịch sử xem, like, rating, watchlist…
- Nêu nhanh module chính: auth, movie, interaction (comment/rating/like/watchlist/history), recommendation, admin/dashboard.

### 3. Demo luồng người dùng (3–4 phút)

> Dùng trình duyệt, login bằng tài khoản user thường.

1. **Đăng nhập**
   - Mở `/login`, nhập tài khoản user.
   - Chỉ ra xử lý lỗi khi nhập sai (nếu có).
2. **Xem danh sách & chi tiết phim**
   - Vào `/movies`:
     - Cho thấy phân trang, filter theo thể loại.
   - Chọn một phim → vào `/movies/[slug]`:
     - Hiển thị poster, mô tả, thể loại, rating.
3. **Tương tác với phim**
   - Tại trang chi tiết phim:
     - Bấm like → icon đổi trạng thái.
     - Đánh giá phim (chọn số sao) → rating tổng cập nhật.
     - Thêm một bình luận → xuất hiện trong danh sách comment.
     - Thêm phim vào watchlist.
4. **Tài khoản & gợi ý**
   - Vào `/account/watchlist`:
     - Cho thấy phim vừa thêm đã xuất hiện.
   - Mở `/recommendations`:
     - Giải thích: danh sách này được tính từ thể loại yêu thích, lịch sử xem, like, rating, trending.
     - Có thể so sánh nhanh với user mới (nếu chuẩn bị sẵn) để minh họa cold-start.

### 4. Demo luồng admin (2–3 phút)

> Đăng xuất user thường, đăng nhập bằng tài khoản admin.

1. **Truy cập khu vực admin**
   - Vào `/admin`:
     - Trình bày layout admin, menu trái (movies, genres, users, statistics…).
2. **Quản lý nội dung (tùy mức độ hoàn thiện)**
   - Mở `/admin/movies`:
     - Cho thấy danh sách phim, thao tác basic (nếu đã làm CRUD).
   - Mở `/admin/genres` hoặc `/admin/users` (nếu có).
3. **Dashboard thống kê**
   - Mở `/admin/statistics`:
     - Giải thích các số liệu: tổng user, movie, comment, rating, like, watchlist, watch logs.
     - Nếu có: biểu đồ trending movies, top genres – liên hệ với module recommendation.

### 5. Kiểm thử & độ tin cậy (1 phút)

- Nhấn mạnh:
  - Backend:
    - Đã viết unit/service test cho các module chính (auth, movie/genre, tương tác, recommendation, dashboard…).
  - Frontend:
    - Đã thiết kế và chạy manual test cho các luồng chính, theo tài liệu `ui_test_plan.md` và `ui_test_cases_main_flows.md`.
    - Có báo cáo `ui_test_report_phase_6.md` tổng hợp kết quả và bug.

### 6. Kết luận & hướng phát triển (1 phút)

- Tóm tắt lại:
  - Hệ thống đã đáp ứng các nhóm chức năng trong SRS: xem phim, tương tác, cá nhân hóa, quản trị.
  - Đã hiện thực logic gợi ý rule-based dựa trên nhiều tín hiệu hành vi.
- Hướng phát triển:
  - Nâng cấp thuật toán recommendation (ML/CF).
  - Mở rộng thêm tính năng social, tối ưu UI/UX, tối ưu truy vấn cho dữ liệu lớn.

