# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM

(Software Requirement Specification – SRS)



Dự án: Hệ thống gợi ý phim yêu thích của người dùng
thông qua thể loại phim

Phiên bản 1.0

Tài liệu dùng cho phân tích, thiết kế, phát triển và kiểm thử hệ thống





Cần Thơ, năm 2026



Mục lục

## 1. Giới thiệu

## 2. Mô tả tổng thể hệ thống

## 3. Yêu cầu chức năng

## 4. Yêu cầu dữ liệu và mô hình thông tin

## 5. Yêu cầu phi chức năng

## 6. Phân tích sơ đồ Use Case

## 7. Đặc tả Use Case chi tiết

## 8. Phân tích Activity Diagram

## 9. Phân tích Sequence Diagram

## 10. Tiêu chí nghiệm thu tổng quát

## 11. Kết luận



## 1. Giới thiệu

### 1.1 Mục đích

Tài liệu SRS này mô tả đầy đủ các yêu cầu phần mềm cho hệ thống gợi ý phim yêu thích của người dùng thông qua thể loại phim. Tài liệu được xây dựng dựa trên các phân tích nghiệp vụ, sơ đồ Use Case, mô hình dữ liệu ERD và các yêu cầu chức năng, phi chức năng đã được thống nhất trong quá trình trao đổi.

Xác định phạm vi hệ thống và các chức năng mà hệ thống phải cung cấp.

Làm cơ sở cho thiết kế giao diện, kiến trúc xử lý, cơ sở dữ liệu và API.

Là tài liệu tham chiếu cho kiểm thử, nghiệm thu và mở rộng hệ thống trong tương lai.

### 1.2 Phạm vi dự án

### 1.2.1 Tổng quan sản phẩm

Sản phẩm là một ứng dụng web cho phép người dùng tìm kiếm, xem phim và nhận gợi ý phim phù hợp dựa trên thể loại yêu thích và hành vi sử dụng. Hệ thống hỗ trợ hai nhóm người dùng chính là người xem phim và quản trị viên. Mục tiêu cốt lõi của hệ thống là nâng cao trải nghiệm cá nhân hóa thay vì chỉ cung cấp một website xem phim thông thường.

### 1.2.2 Chức năng trong phạm vi (In-scope)

Đăng ký, đăng nhập, đăng xuất và quản lý thông tin tài khoản.

Tìm kiếm phim, duyệt phim theo danh mục, xem thông tin chi tiết và xem phim trực tuyến.

Thích phim, lưu phim theo dõi, bình luận, đánh giá và xem lịch sử xem.

Quản lý thể loại yêu thích và gợi ý phim phù hợp cho người dùng đã đăng nhập.

Quản trị phim, thể loại, người dùng, lịch chiếu, diễn viên, đạo diễn và tập phim.

Thống kê xu hướng phim phục vụ quản trị nội dung và vận hành hệ thống.

### 1.2.3 Chức năng ngoài phạm vi (Out-of-scope)

Ứng dụng di động native cho Android hoặc iOS.

Thanh toán trực tuyến, thuê bao trả phí hoặc mua nội dung số.

Mạng xã hội tích hợp sâu như nhắn tin, chia sẻ công khai danh sách xem hoặc kết bạn.

Livestream hoặc phát sóng trực tiếp.

### 1.3 Thuật ngữ và định nghĩa



### 1.4 Tài liệu và cơ sở đầu vào

Tài liệu này được tổng hợp từ các nguồn đầu vào đã phân tích trong quá trình xây dựng đề tài, bao gồm: mô tả nghiệp vụ ban đầu, danh sách chức năng giao diện người dùng và quản trị, các yêu cầu phi chức năng, sơ đồ ERD, phân tích Use Case, phân tích Activity Diagram và Sequence Diagram.

## 2. Mô tả tổng thể hệ thống

### 2.1 Bối cảnh sản phẩm

Hệ thống được xây dựng như một nền tảng xem phim trực tuyến có bổ sung lớp cá nhân hóa. Thay vì chỉ hiển thị cùng một danh sách phim cho mọi người dùng, hệ thống khai thác dữ liệu thể loại yêu thích, lịch sử xem, lượt thích và đánh giá để đề xuất phim phù hợp với từng người dùng.

### 2.2 Nhóm tác nhân và đặc điểm người dùng



### 2.3 Môi trường vận hành



### 2.4 Giả định và phụ thuộc

Hệ thống có sẵn nguồn dữ liệu phim, poster, mô tả, liên kết phát hoặc tệp video hợp lệ.

Người dùng có kết nối Internet ổn định khi truy cập và xem phim.

Dữ liệu thể loại phim được chuẩn hóa để phục vụ chức năng gợi ý.

Quản trị viên có trách nhiệm cập nhật dữ liệu phim và lịch chiếu thường xuyên.

### 2.5 Ràng buộc thiết kế và triển khai

Mật khẩu phải được băm trước khi lưu trong cơ sở dữ liệu.

Mọi dữ liệu trao đổi giữa client và server phải đi qua HTTPS.

Chức năng gợi ý chỉ được kích hoạt tối ưu cho người dùng đã đăng nhập; người dùng chưa đăng nhập nhận gợi ý mặc định.

Hệ thống phải đảm bảo tính nhất quán giữa phim, thể loại, lịch chiếu, tập phim và lịch sử xem.

## 3. Yêu cầu chức năng

Các yêu cầu chức năng được nhóm theo các phân hệ nghiệp vụ cốt lõi của hệ thống: truy cập và tài khoản, khai thác nội dung phim, tương tác và cá nhân hóa, gợi ý phim và quản trị hệ thống.

### 3.1 Phân hệ truy cập và tài khoản



### 3.2 Phân hệ khai thác nội dung phim



### 3.3 Phân hệ tương tác và cá nhân hóa



### 3.4 Phân hệ quản trị



### 3.5 Quy tắc nghiệp vụ chính

Mỗi người dùng chỉ được đánh giá một lần cho một phim tại một thời điểm; nếu đánh giá lại thì bản ghi cũ được cập nhật.

Lịch sử xem chỉ được lưu khi người dùng đã đăng nhập; khách vãng lai không có lịch sử cá nhân hóa trên tài khoản.

Một phim có thể thuộc nhiều thể loại và một thể loại có thể gắn với nhiều phim.

Chức năng gợi ý ưu tiên dữ liệu thể loại yêu thích, lịch sử xem, lượt thích và đánh giá; nếu dữ liệu còn ít thì trả về gợi ý mặc định theo mức độ phổ biến.

Phim bộ có thể có nhiều tập; phim lẻ không yêu cầu tập phim.

Khi xóa phim hoặc thể loại, hệ thống phải kiểm tra ràng buộc dữ liệu liên quan để tránh mất tính toàn vẹn.

## 4. Yêu cầu dữ liệu và mô hình thông tin

Mô hình dữ liệu của hệ thống được xây dựng để hỗ trợ cả nhu cầu khai thác nội dung lẫn cá nhân hóa. Dữ liệu cần bảo đảm tính toàn vẹn giữa phim, thể loại, lịch sử xem, đánh giá, bình luận và thông tin quản trị.

### 4.1 Đối tượng dữ liệu chính



Hình 4-1. Sơ đồ ERD của hệ thống gợi ý phim theo thể loại



### 4.2 Yêu cầu lưu vết và lịch sử

Hệ thống lưu lịch sử xem để phục vụ chức năng tiếp tục xem và gợi ý phim.

Hệ thống lưu lịch sử tìm kiếm để phân tích hành vi và tối ưu nội dung hiển thị.

Hệ thống lưu lượt thích, bình luận và đánh giá để phục vụ tương tác cộng đồng và tính điểm phim.

Các thay đổi trong khu vực quản trị nên có thể truy vết theo người thao tác và thời điểm thao tác khi triển khai thực tế.

### 4.3 Quy tắc toàn vẹn dữ liệu

Không được tồn tại bản ghi đánh giá hoặc lượt thích tham chiếu đến phim hoặc người dùng đã bị xóa mà không có cơ chế xử lý liên quan.

Một lịch sử xem có thể gắn với phim lẻ hoặc tập phim; với phim bộ, EpisodeID cần được ưu tiên lưu nếu có.

Quan hệ nhiều-nhiều giữa phim và thể loại, phim và diễn viên, phim và đạo diễn phải được quản lý qua bảng liên kết.

Xóa thể loại hoặc phim phải kiểm tra và xử lý các quan hệ liên kết trước khi thực hiện thao tác.

## 5. Yêu cầu phi chức năng

### 5.1 Hiệu năng



### 5.2 Bảo mật



### 5.3 Độ tin cậy và khả dụng



### 5.4 Tương thích, dễ dùng và khả năng bảo trì



## 6. Phân tích sơ đồ Use Case



Hình 6-1. Sơ đồ Use Case tổng quan của hệ thống

Sơ đồ Use Case của hệ thống phản ánh ba nhóm tác nhân chính là Khách vãng lai, Người dùng đã đăng nhập và Quản trị viên. Mỗi tác nhân tương tác với hệ thống theo một phạm vi quyền hạn khác nhau nhưng đều xoay quanh mục tiêu chung là khai thác nội dung phim và đảm bảo dữ liệu phục vụ gợi ý được duy trì chính xác.

### 6.1 Phân tích theo tác nhân

### 6.1.1 Khách vãng lai

Khách vãng lai là người dùng chưa đăng nhập. Tác nhân này chỉ được phép sử dụng các chức năng công khai như đăng ký, đăng nhập, tìm kiếm phim, xem thông tin phim và xem phim. Khách vãng lai không được phép lưu phim, đánh giá, bình luận hoặc nhận gợi ý cá nhân hóa vì hệ thống chưa có dữ liệu danh tính và sở thích của người dùng.

### 6.1.2 Người dùng đã đăng nhập

Người dùng đã đăng nhập là tác nhân trung tâm của hệ thống. Ngoài các chức năng xem phim, tác nhân này còn có thể thích phim, lưu phim theo dõi, bình luận, đánh giá, xem lịch sử, cập nhật thể loại yêu thích và nhận gợi ý phim phù hợp. Đây là nhóm chức năng tạo ra dữ liệu hành vi để thuật toán gợi ý hoạt động hiệu quả.

### 6.1.3 Quản trị viên

Quản trị viên chịu trách nhiệm quản lý dữ liệu phim và người dùng. Các use case quản trị không trực tiếp tạo trải nghiệm xem phim cho người dùng cuối, nhưng ảnh hưởng mạnh đến chất lượng dữ liệu đầu vào của hệ thống như nội dung phim, thể loại, diễn viên, đạo diễn, tập phim và lịch chiếu.

### 6.2 Nhóm Use Case theo nghiệp vụ

Nhóm chức năng cơ bản: Đăng ký, đăng nhập, tìm kiếm phim, xem thông tin phim, xem phim.

Nhóm tương tác người dùng: Thích phim, lưu phim, bình luận, đánh giá.

Nhóm cá nhân hóa: Cập nhật thể loại yêu thích, lịch sử xem, tiếp tục xem, nhận gợi ý phim.

Nhóm quản trị: Quản lý phim, thể loại, người dùng, lịch chiếu, diễn viên, đạo diễn, tập phim, thống kê.

### 6.3 Quan hệ giữa các Use Case

Use Case 'Tiếp tục xem phim' là một mở rộng của Use Case 'Xem phim' vì chỉ xuất hiện khi hệ thống đã có dữ liệu xem trước đó.

Use Case 'Nhận gợi ý phim phù hợp' phụ thuộc logic vào các dữ liệu sinh ra từ 'Cập nhật thể loại yêu thích', 'Xem lịch sử xem', 'Nhấn thích phim' và 'Đánh giá phim'.

Các Use Case quản trị như 'Gán thể loại cho phim' và 'Quản lý phim' có ảnh hưởng gián tiếp đến độ chính xác của gợi ý phim vì chúng quyết định chất lượng dữ liệu đầu vào.

### 6.4 Ma trận tác nhân – chức năng



## 7. Đặc tả Use Case chi tiết

Phần này trình bày đặc tả Use Case ở dạng bảng cho toàn bộ chức năng chính của hệ thống. Mỗi Use Case bao gồm tên, mã, tác nhân, mục tiêu, điều kiện trước, điều kiện sau, luồng chính và luồng ngoại lệ hoặc luồng thay thế.

## 1. Use Case: Đăng ký tài khoản



## 2. Use Case: Đăng nhập



## 3. Use Case: Tìm kiếm phim



## 4. Use Case: Xem thông tin phim



## 5. Use Case: Xem phim



## 6. Use Case: Nhấn thích phim



## 7. Use Case: Lưu phim vào danh sách theo dõi
### 7.1 Use Case: Lưu phim vào danh sách theo dõi

- **Tên Use Case**: Lưu phim vào danh sách theo dõi  
- **Mã Use Case**: UC7  
- **Tác nhân chính**: Người dùng đã đăng nhập  
- **Mục tiêu**: Cho phép người dùng lưu nhanh một phim vào danh sách “theo dõi” để xem sau.  
- **Điều kiện trước**:  
  - Người dùng đã đăng nhập vào hệ thống.  
  - Phim cần lưu tồn tại trong hệ thống và đang ở trạng thái hoạt động.  
- **Điều kiện sau**:  
  - Nếu phim chưa có trong danh sách theo dõi: một bản ghi tương ứng được tạo trong bảng `WATCHLIST_ITEMS`.  
  - Nếu phim đã có trong danh sách theo dõi: hệ thống có thể giữ nguyên và thông báo “phim đã nằm trong danh sách theo dõi” hoặc cho phép người dùng bỏ theo dõi (nếu thiết kế nút dạng toggle).  
- **Luồng chính**:  
  1. Người dùng mở trang chi tiết phim hoặc danh sách phim.  
  2. Người dùng nhấn nút “Lưu theo dõi” (hoặc biểu tượng bookmark) trên một phim.  
  3. Hệ thống kiểm tra trạng thái đăng nhập của người dùng.  
  4. Hệ thống kiểm tra xem đã tồn tại bản ghi trong `WATCHLIST_ITEMS` với cặp (UserID, MovieID) hay chưa.  
  5. Nếu chưa tồn tại, hệ thống tạo mới bản ghi `WATCHLIST_ITEMS` với UserID, MovieID, CreatedAt = thời điểm hiện tại.  
  6. Hệ thống trả về thông báo thành công và cập nhật giao diện (ví dụ đổi màu icon, hiện text “Đã lưu”).  
- **Luồng thay thế / ngoại lệ**:  
  - *A1 – Người dùng chưa đăng nhập*:  
    1. Tại bước 3, hệ thống phát hiện người dùng chưa đăng nhập.  
    2. Hệ thống từ chối thao tác lưu, hiển thị thông báo yêu cầu đăng nhập và/hoặc chuyển hướng đến trang đăng nhập.  
  - *A2 – Phim đã nằm trong danh sách theo dõi*:  
    1. Tại bước 5, hệ thống phát hiện đã có bản ghi `WATCHLIST_ITEMS` (UserID, MovieID).  
    2. Hệ thống: hoặc chỉ trả về thông báo “Phim đã trong danh sách theo dõi”, hoặc (nếu thiết kế nút dạng toggle) cho phép người dùng nhấn thêm lần nữa để xóa bản ghi khỏi `WATCHLIST_ITEMS` và cập nhật giao diện về trạng thái “Chưa theo dõi”.  
- **Yêu cầu đặc biệt / ràng buộc**:  
  - Một cặp (UserID, MovieID) chỉ được tồn tại tối đa một bản ghi trong `WATCHLIST_ITEMS`.  
  - Thao tác lưu/bỏ lưu cần thực hiện trong thời gian phản hồi chấp nhận được (thường < 1–2 giây trong điều kiện tải bình thường).  
## 8. Use Case: Cập nhật thể loại yêu thích



## 9. Use Case: Bình luận phim



## 10. Use Case: Đánh giá phim



## 11. Use Case: Xem lịch sử xem phim



## 12. Use Case: Quản lý thông tin tài khoản



## 13. Use Case: Nhận gợi ý phim phù hợp
### 7.2 Use Case: Nhận gợi ý phim phù hợp

- **Tên Use Case**: Nhận gợi ý phim phù hợp  
- **Mã Use Case**: UC13  
- **Tác nhân chính**: Người dùng đã đăng nhập  
- **Mục tiêu**: Cung cấp danh sách phim được gợi ý dựa trên thể loại yêu thích và hành vi tương tác của người dùng.  
- **Điều kiện trước**:  
  - Người dùng đã đăng nhập.  
  - Hệ thống có dữ liệu phim, thể loại và ít nhất một phần dữ liệu hành vi (thể loại yêu thích, lịch sử xem, lượt thích, đánh giá…) đối với người dùng hoặc dữ liệu phổ biến toàn hệ thống.  
- **Điều kiện sau**:  
  - Người dùng nhận được danh sách phim gợi ý kèm các thông tin cơ bản (tên, poster, thể loại, điểm đánh giá…).  
  - Các gợi ý có thể được ghi log lại để phục vụ phân tích sau này (nếu cần).  
- **Luồng chính**:  
  1. Người dùng truy cập trang “Gợi ý phim” hoặc khu vực gợi ý trên trang chủ sau khi đăng nhập.  
  2. Hệ thống truy vấn dữ liệu liên quan đến người dùng: thể loại yêu thích (`USERS_GENRE`), lịch sử xem (`WATCH_LOGS`), lượt thích (`LIKES`), đánh giá (`RATINGS`).  
  3. Hệ thống áp dụng thuật toán gợi ý (rule-based) để tính điểm cho các phim tiềm năng.  
  4. Hệ thống sắp xếp phim theo điểm gợi ý giảm dần và giới hạn số lượng (ví dụ: 20 phim).  
  5. Hệ thống trả kết quả cho giao diện người dùng.  
  6. Giao diện hiển thị danh sách phim gợi ý dưới dạng lưới/thẻ.  
- **Luồng thay thế / ngoại lệ**:  
  - *B1 – Người dùng chưa có đủ dữ liệu hành vi*:  
    1. Tại bước 2, hệ thống phát hiện người dùng mới, chưa có lịch sử xem/like/rating.  
    2. Hệ thống sử dụng gợi ý mặc định dựa trên phim phổ biến (ví dụ top xem nhiều, đánh giá cao, mới phát hành).  
    3. Các bước 4–6 vẫn thực hiện bình thường nhưng nguồn dữ liệu là “popular movie”.  
  - *B2 – Người dùng chưa đăng nhập*:  
    1. Người dùng truy cập trang gợi ý khi chưa đăng nhập.  
    2. Hệ thống có thể: yêu cầu đăng nhập trước khi hiển thị danh sách gợi ý cá nhân hoặc hiển thị danh sách phim phổ biến nhưng không gắn nhãn cá nhân hóa.  
- **Yêu cầu đặc biệt / ràng buộc**:  
  - Thuật toán ban đầu có thể là rule-based với công thức tính điểm kết hợp các yếu tố: mức độ khớp thể loại, lịch sử xem, lượt thích, đánh giá và độ phổ biến.  
  - Hệ thống nên hạn chế gợi ý lại liên tục các phim mà người dùng đã xem xong trừ khi có lý do đặc biệt (phim đang hot, vừa có bản mới, v.v.).  

## 14. Use Case: Tiếp tục xem phim



## 15. Use Case: Quản lý phim



## 16. Use Case: Quản lý thể loại



## 17. Use Case: Quản lý người dùng



## 18. Use Case: Quản lý lịch chiếu / thời gian đăng phim



## 19. Use Case: Thống kê xu hướng phim



## 20. Use Case: Gán thể loại cho phim



### 7.21 Ghi chú sử dụng đặc tả Use Case

Đặc tả Use Case là cơ sở để xây dựng giao diện, thiết kế API, viết test case và kiểm thử nghiệm thu. Khi triển khai thực tế, từng Use Case có thể được mở rộng thêm các tiền điều kiện chi tiết, quy tắc nghiệp vụ hoặc tiêu chí bảo mật tùy theo phạm vi phát triển của nhóm.

## 8. Phân tích Activity Diagram

Activity Diagram được dùng để mô tả luồng xử lý nghiệp vụ từ khi chức năng bắt đầu đến khi kết thúc, cho thấy các bước tuần tự, điểm rẽ nhánh và kết quả đầu ra của quy trình.

### 8.1 Hoạt động đăng nhập



Hình 8-1. Activity Diagram cho chức năng đăng nhập



### 8.2 Hoạt động xem phim



Hình 8-2. Activity Diagram cho chức năng xem phim



### 8.3 Hoạt động đánh giá phim



Hình 8-3. Activity Diagram cho chức năng đánh giá phim



### 8.4 Hoạt động nhận gợi ý phim



Hình 8-4. Activity Diagram cho chức năng nhận gợi ý phim



### 8.5 Hoạt động quản lý phim



Hình 8-5. Activity Diagram cho chức năng quản lý phim



## 9. Phân tích Sequence Diagram

Sequence Diagram mô tả trình tự tương tác giữa các thành phần của hệ thống theo thời gian, từ tác nhân, giao diện, controller, service đến cơ sở dữ liệu và các dịch vụ liên quan. Phân tích này là cơ sở để thiết kế lớp xử lý và API.

### 9.1 Trình tự đăng nhập



Hình 9-1. Sequence Diagram cho chức năng đăng nhập



### 9.2 Trình tự xem phim



Hình 9-2. Sequence Diagram cho chức năng xem phim



### 9.3 Trình tự đánh giá phim



Hình 9-3. Sequence Diagram cho chức năng đánh giá phim



### 9.4 Trình tự nhận gợi ý phim



Hình 9-4. Sequence Diagram cho chức năng nhận gợi ý phim



### 9.5 Trình tự quản lý phim



Hình 9-5. Sequence Diagram cho chức năng quản lý phim



## 10. Tiêu chí nghiệm thu tổng quát

Hệ thống được xem là đạt yêu cầu khi các nhóm chức năng, dữ liệu và yêu cầu phi chức năng trọng yếu đều đáp ứng được các tiêu chí sau:

Tất cả use case của Khách vãng lai, Người dùng đã đăng nhập và Admin phải hoạt động đúng theo đặc tả.

Tìm kiếm phim trong điều kiện tải bình thường phản hồi dưới 2 giây.

Người dùng đăng nhập có thể nhận danh sách phim gợi ý dựa trên thể loại yêu thích và lịch sử tương tác.

Admin có thể thêm, sửa, xóa phim và quản lý thể loại mà không làm sai lệch tính toàn vẹn dữ liệu.

Mật khẩu được lưu dưới dạng băm; mọi truy cập hệ thống được phục vụ qua HTTPS.

Hệ thống hoạt động ổn định với tối thiểu 10.000 người dùng đồng thời và đạt 99,9% uptime/tháng.

## 11. Kết luận

Tài liệu SRS này xác định phạm vi, chức năng, dữ liệu, yêu cầu phi chức năng và đặc tả Use Case của hệ thống gợi ý phim theo thể loại. Nội dung của tài liệu phản ánh đầy đủ các phân tích đã thống nhất: hệ thống không chỉ phục vụ việc xem phim mà còn tập trung vào cá nhân hóa trải nghiệm người dùng thông qua lịch sử xem, thể loại yêu thích, lượt thích và đánh giá. Đây là cơ sở quan trọng để tiếp tục thiết kế kiến trúc, xây dựng giao diện, triển khai cơ sở dữ liệu, lập trình chức năng và kiểm thử hệ thống trong giai đoạn tiếp theo.