## Kế hoạch kiểm thử UI frontend – Giai đoạn 6

### 1. Mục tiêu

- Đảm bảo các **luồng UI chính** trên frontend hoạt động phù hợp với SRS, Use Case và API.
- Kiểm tra **trải nghiệm người dùng**: điều hướng, phản hồi (loading/empty/error), hiển thị dữ liệu, trạng thái sau tương tác.
- Ghi nhận **bug UI/UX** và hành vi sai khác so với yêu cầu để fix ở các task tiếp theo.

### 2. Phạm vi kiểm thử

- **Nhóm người dùng thường**
  - Auth:
    - `/login`, `/register`.
    - Truy cập các trang yêu cầu đăng nhập: `/account`, `/account/watchlist`, `/account/history`, `/recommendations`.
  - Khai thác nội dung phim:
    - `/` (nếu đã có layout trang chủ).
    - `/movies`, `/movies/[slug]`, `/movies/[slug]/watch`.
    - `/genres` và filter theo thể loại (nếu đã triển khai).
  - Tương tác & cá nhân hóa:
    - Comment: thêm/xem danh sách bình luận.
    - Rating: đánh giá lần đầu, cập nhật rating.
    - Like: thích/bỏ thích phim.
    - Watchlist: lưu/bỏ lưu phim, trang `/account/watchlist`.
    - Watch history & continue watching (nếu UI đã có).
  - Gợi ý:
    - `/recommendations` – gợi ý cho user hiện tại, trạng thái user mới vs user có dữ liệu.

- **Nhóm admin**
  - Layout & phân quyền:
    - `/admin` và các trang con.
  - Trang quản trị chính (tùy phần đã hoàn thiện trong scope 13):
    - `/admin/movies`, `/admin/genres`, `/admin/users`, `/admin/statistics`, các trang khác nếu có.

### 3. Phụ thuộc & ràng buộc

- Phụ thuộc WBS:
  - Frontend đã hoàn thành các task:
    - 6 – Trang danh sách & chi tiết phim.
    - 8 – UI tương tác phim (comment, rating, like).
    - 11 – Trang gợi ý phim.
    - 13 – Trang Admin frontend.
- Backend:
  - API chạy ổn định theo `docs/api/openapi.yaml`.
  - DB đã được migrate và seed dữ liệu (phim, thể loại, user, admin).

### 4. Môi trường kiểm thử

- **Backend**
  - Chạy ở môi trường dev, ví dụ: `http://localhost:8080`.
  - Sử dụng cấu hình `application-dev.yml` và DB MySQL local với dữ liệu seed.

- **Frontend**
  - Chạy Next.js ở `http://localhost:3000` (hoặc port tương ứng).
  - Build/dev mode tùy tình huống, ưu tiên **dev mode** để dễ debug UI.

- **Tài khoản test**
  - Tài khoản **admin** mặc định (từ migration seed).
  - Ít nhất 1–2 tài khoản **user thường**:
    - User A: đã có lịch sử xem, like, rating, watchlist.
    - User B: user mới để test luồng cold-start (recommendation, empty states).

### 5. Phương pháp & phạm vi kiểm thử

- **Phương pháp**: Manual test trên trình duyệt (Chrome/Edge), có thể dùng DevTools để quan sát request/response.
- **Tiêu chí chung cho mỗi page/luồng**:
  - Điều hướng: đường dẫn, redirect khi chưa đăng nhập, menu/breadcrumb.
  - Trạng thái:
    - Loading: skeleton/spinner hiển thị hợp lý.
    - Empty: thông báo khi không có dữ liệu.
    - Error: thông báo lỗi rõ ràng khi API lỗi (401/403/500…).
  - Tương tác:
    - Nút bấm, form, validation phía UI.
    - Kết quả sau thao tác (UI và dữ liệu hiển thị lại).

### 6. Tổ chức test case

- Các test case chi tiết được định nghĩa trong:
  - `docs/frontend/ui_test_cases_main_flows.md`
- Mỗi test case có cấu trúc:
  - **ID** (ví dụ: `TC-LOGIN-01`).
  - **Module** (Auth / Movie / Interaction / Recommendation / Admin).
  - **Route/Page**.
  - **Pre-condition**.
  - **Test Steps**.
  - **Expected Result**.
  - **Status** (Not Run / Pass / Fail).
  - **Bug Id** (liên kết tới bug list/issue tracker).

### 7. Kết quả & báo cáo

- Kết quả kiểm thử được tổng hợp trong:
  - `docs/frontend/ui_test_report_phase_6.md`
- Nội dung báo cáo:
  - Tổng số test case, tỉ lệ Pass/Fail.
  - Danh sách bug quan trọng cần xử lý trước khi nghiệm thu.
  - Nhận xét chung về UX, performance cơ bản trên frontend.

