## Test cases UI – Các luồng chính frontend

> Ghi chú: Đây là danh sách test case khung cho kiểm thử manual. Khi thực hiện, bổ sung cột **Status** và **Bug Id** theo thực tế.

### 1. Auth & Tài khoản

#### TC-LOGIN-01 – Đăng nhập thành công

- **Module**: Auth  
- **Route/Page**: `/login`  
- **Pre-condition**:
  - Tồn tại tài khoản user hợp lệ trong hệ thống.
- **Steps**:
  1. Mở trang `/login`.
  2. Nhập username/password hợp lệ.
  3. Bấm nút “Đăng nhập”.
- **Expected Result**:
  - Hiển thị trạng thái loading (nếu có).
  - Điều hướng sang trang mặc định sau đăng nhập (vd. `/` hoặc `/account`).
  - Header hiển thị trạng thái đã đăng nhập (tên user, menu account).

#### TC-LOGIN-02 – Đăng nhập thất bại (sai mật khẩu)

- **Module**: Auth  
- **Route/Page**: `/login`  
- **Pre-condition**:
  - Tồn tại tài khoản user.
- **Steps**:
  1. Mở `/login`.
  2. Nhập đúng username nhưng sai password.
  3. Bấm “Đăng nhập”.
- **Expected Result**:
  - Không chuyển trang.
  - Hiển thị thông báo lỗi thân thiện (từ API 401).
  - Field password được reset/giữ nguyên tùy design nhưng không lộ thông tin nhạy cảm.

#### TC-REGISTER-01 – Đăng ký tài khoản mới thành công

- **Module**: Auth  
- **Route/Page**: `/register`  
- **Pre-condition**:
  - Username chưa tồn tại.
- **Steps**:
  1. Mở `/register`.
  2. Nhập đầy đủ thông tin (username, password, confirm nếu có, full name).
  3. Bấm “Đăng ký”.
- **Expected Result**:
  - Validate phía UI (required, format).
  - Khi hợp lệ, gọi API `POST /api/auth/register`, nhận phản hồi thành công.
  - Có thể tự động đăng nhập hoặc chuyển sang `/login` tùy design, hiển thị message phù hợp.

#### TC-ACCOUNT-01 – Bảo vệ route /account khi chưa đăng nhập

- **Module**: Auth/Account  
- **Route/Page**: `/account`  
- **Pre-condition**:
  - User chưa đăng nhập.
- **Steps**:
  1. Truy cập trực tiếp `/account` trên trình duyệt.
- **Expected Result**:
  - Hệ thống redirect sang `/login` hoặc hiển thị thông báo yêu cầu đăng nhập.

### 2. Danh sách & chi tiết phim

#### TC-MOVIE-LIST-01 – Xem danh sách phim có phân trang

- **Module**: Movie  
- **Route/Page**: `/movies`  
- **Pre-condition**:
  - DB có nhiều phim hơn kích thước một trang.
- **Steps**:
  1. Mở `/movies`.
  2. Quan sát danh sách phim, pagination.
  3. Chuyển sang trang tiếp theo bằng pagination.
- **Expected Result**:
  - Khi load lần đầu hiển thị trạng thái loading (nếu có).
  - Sau khi load, hiển thị lưới `movie-card` với thông tin: title, poster, rating.
  - Pagination hoạt động, chuyển trang hiển thị phim khác.

#### TC-MOVIE-LIST-02 – Filter theo thể loại

- **Module**: Movie/Genre  
- **Route/Page**: `/movies` hoặc `/genres`  
- **Pre-condition**:
  - Đã có danh sách thể loại và phim gắn genre.
- **Steps**:
  1. Mở trang danh sách phim.
  2. Chọn một thể loại cụ thể ở filter.
  3. Quan sát danh sách phim sau filter.
- **Expected Result**:
  - Gọi API kèm tham số genreId (theo openapi).
  - Danh sách chỉ hiển thị phim thuộc thể loại đã chọn.

#### TC-MOVIE-DETAIL-01 – Xem chi tiết phim

- **Module**: Movie  
- **Route/Page**: `/movies/[slug]`  
- **Pre-condition**:
  - Có ít nhất một phim trong DB với slug hợp lệ.
- **Steps**:
  1. Từ `/movies`, click vào một `movie-card`.
  2. Quan sát trang chi tiết `/movies/[slug]`.
- **Expected Result**:
  - Hiển thị title, mô tả, poster, genres, rating, có chỗ cho comment/like/watchlist.
  - Loading/empty/error được xử lý đúng (vd. slug không tồn tại → trang 404 hoặc message).

#### TC-MOVIE-WATCH-01 – Trang xem phim & tiếp tục xem

- **Module**: Movie/WatchHistory  
- **Route/Page**: `/movies/[slug]/watch`  
- **Pre-condition**:
  - Phim có ít nhất một tập hoặc nguồn video.
- **Steps**:
  1. Truy cập `/movies/[slug]/watch`.
  2. Play video một đoạn (nếu demo có).
  3. Quay lại trang sau đó truy cập lại.
- **Expected Result**:
  - Giao diện player hiển thị bình thường.
  - Nếu đã có tích hợp watch history/continue watching: hiển thị tiến độ đã xem, nút tiếp tục xem.

### 3. Tương tác: Comment / Rating / Like / Watchlist

#### TC-COMMENT-01 – Thêm bình luận cho phim

- **Module**: Comment  
- **Route/Page**: `/movies/[slug]`  
- **Pre-condition**:
  - User đã đăng nhập.
- **Steps**:
  1. Mở trang chi tiết phim.
  2. Nhập nội dung vào form comment.
  3. Bấm gửi.
- **Expected Result**:
  - Validate required phía UI.
  - Gọi API `POST /api/movies/{movieId}/comments`.
  - Sau khi thành công, comment mới xuất hiện trong danh sách, form được reset.

#### TC-RATING-01 – Đánh giá phim lần đầu

- **Module**: Rating  
- **Route/Page**: `/movies/[slug]`  
- **Pre-condition**:
  - User đăng nhập, chưa từng rating phim đó.
- **Steps**:
  1. Trên trang chi tiết phim, chọn số sao (1–5).
  2. Xác nhận (nếu có).
- **Expected Result**:
  - Gọi `POST /api/movies/{movieId}/ratings` với `ratingValue`.
  - Điểm rating trung bình và số lượt đánh giá cập nhật trên UI.

#### TC-RATING-02 – Cập nhật rating cho phim đã đánh giá

- **Module**: Rating  
- **Route/Page**: `/movies/[slug]`  
- **Pre-condition**:
  - User đã từng rating phim đó.
- **Steps**:
  1. Thay đổi số sao.
  2. Xác nhận.
- **Expected Result**:
  - API vẫn là `POST /api/movies/{movieId}/ratings` nhưng backend update bản ghi cũ.
  - UI cập nhật lại điểm trung bình và số lượt đánh giá (nếu có thay đổi).

#### TC-LIKE-01 – Thích / bỏ thích phim

- **Module**: Like  
- **Route/Page**: `/movies/[slug]`  
- **Pre-condition**:
  - User đăng nhập.
- **Steps**:
  1. Bấm nút like (icon trái tim) lần 1.
  2. Quan sát trạng thái nút.
  3. Bấm lại lần 2.
- **Expected Result**:
  - Lần 1: gọi `POST /api/movies/{movieId}/like/toggle`, trả về `liked = true`, icon chuyển sang trạng thái “đã thích”.
  - Lần 2: toggle ngược lại, icon trở về trạng thái ban đầu.

#### TC-WATCHLIST-01 – Lưu phim vào danh sách theo dõi

- **Module**: Watchlist  
- **Route/Page**: `/movies/[slug]`, `/account/watchlist`  
- **Pre-condition**:
  - User đăng nhập, phim chưa ở watchlist.
- **Steps**:
  1. Tại trang chi tiết phim, bấm nút watchlist (bookmark).
  2. Mở `/account/watchlist`.
- **Expected Result**:
  - API `POST /api/movies/{movieId}/watchlist/toggle` trả về `inWatchlist = true`.
  - Trang `/account/watchlist` hiển thị phim vừa thêm.

#### TC-WATCHLIST-02 – Bỏ lưu phim khỏi watchlist

- **Module**: Watchlist  
- **Route/Page**: `/account/watchlist`  
- **Pre-condition**:
  - Phim đã có trong watchlist user.
- **Steps**:
  1. Tại `/account/watchlist`, bấm nút bỏ lưu trên một phim.
  2. Reload trang.
- **Expected Result**:
  - API toggle watchlist được gọi, trả `inWatchlist = false`.
  - Phim biến mất khỏi danh sách watchlist.

### 4. Gợi ý phim – Recommendation

#### TC-RECO-01 – Gợi ý cho user có dữ liệu hành vi

- **Module**: Recommendation  
- **Route/Page**: `/recommendations`  
- **Pre-condition**:
  - User đăng nhập, có lịch sử xem/like/rating/genres yêu thích.
- **Steps**:
  1. Truy cập `/recommendations`.
- **Expected Result**:
  - Hiển thị trạng thái loading khi gọi `GET /api/recommendations/me`.
  - Sau đó hiển thị danh sách `movie-card` gợi ý.
  - Không hiển thị empty state nếu có dữ liệu.

#### TC-RECO-02 – Gợi ý cho user mới (cold-start)

- **Module**: Recommendation  
- **Route/Page**: `/recommendations`  
- **Pre-condition**:
  - User đăng nhập nhưng gần như chưa có lịch sử/like/rating (user mới).
- **Steps**:
  1. Đăng nhập bằng user mới.
  2. Mở `/recommendations`.
- **Expected Result**:
  - Vẫn hiển thị danh sách phim (dựa trên phổ biến/top rating theo thiết kế).
  - Nếu hoàn toàn không có candidate thì hiển thị empty state hợp lý.

### 5. Admin – Quản trị & Dashboard

#### TC-ADMIN-ACCESS-01 – Ngăn truy cập admin bằng user thường

- **Module**: Admin/Auth  
- **Route/Page**: `/admin`  
- **Pre-condition**:
  - Đăng nhập bằng tài khoản user thường (role USER).
- **Steps**:
  1. Truy cập `/admin` hoặc một route con như `/admin/movies`.
- **Expected Result**:
  - Bị redirect hoặc hiển thị thông báo không đủ quyền (403).

#### TC-ADMIN-ACCESS-02 – Truy cập admin bằng tài khoản ADMIN

- **Module**: Admin  
- **Route/Page**: `/admin`  
- **Pre-condition**:
  - Đăng nhập bằng tài khoản có role ADMIN.
- **Steps**:
  1. Truy cập `/admin`.
- **Expected Result**:
  - Hiển thị layout admin (sidebar, header, nội dung).
  - Các menu chức năng admin xuất hiện đầy đủ theo thiết kế.

#### TC-ADMIN-MOVIE-01 – Xem danh sách phim admin

- **Module**: Admin/Movie  
- **Route/Page**: `/admin/movies`  
- **Pre-condition**:
  - Đăng nhập admin.
- **Steps**:
  1. Mở `/admin/movies`.
- **Expected Result**:
  - Hiển thị bảng/ lưới phim với các thao tác CRUD (tùy phần đã làm).
  - Loading/empty/error state được xử lý đúng.

#### TC-ADMIN-STAT-01 – Xem dashboard thống kê

- **Module**: Admin/Dashboard  
- **Route/Page**: `/admin/statistics` (hoặc tương đương)  
- **Pre-condition**:
  - Đăng nhập admin, backend đã cung cấp API dashboard.
- **Steps**:
  1. Mở trang thống kê admin.
- **Expected Result**:
  - Hiển thị số liệu tổng quan (user, movie, comment, rating, like, watchlist, watch logs).
  - Biểu đồ/bảng về trending movies, top genres (nếu UI đã có).

---

> Khi thực hiện kiểm thử:
> - Thêm cột **Status** (Not Run / Pass / Fail) và **Bug Id** bên cạnh mỗi test case.
> - Mỗi bug nên ghi rõ: bước tái hiện, dữ liệu test, URL, ảnh chụp màn hình và response API (nếu liên quan).

