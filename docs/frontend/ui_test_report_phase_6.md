## Báo cáo kiểm thử UI – Giai đoạn 6 (Frontend)

### 1. Thông tin chung

- **Phase**: Giai đoạn 6 – Kiểm thử & hoàn thiện.
- **Task**: 14.2 – Test frontend (Kiểm thử manual/UI các luồng chính).
- **Người thực hiện**: Frontend Dev.
- **Thời gian**: _[cập nhật khi thực hiện]_.

### 2. Tóm tắt kết quả

- **Tổng số test case**: _[TC_TOTAL]_  
- **Pass**: _[TC_PASS]_  
- **Fail**: _[TC_FAIL]_  
- **Not Run**: _[TC_NOT_RUN]_  

- **Đánh giá chung**:
  - _[Ví dụ: “Các luồng chính hoạt động ổn định, còn X bug mức Medium, 0 bug Critical blocking release.”]_

### 3. Kết quả chi tiết theo nhóm luồng

> Mẫu bảng – có thể copy nhiều lần cho từng nhóm (Auth, Movie, Interaction, Recommendation, Admin).

#### 3.1. Auth & Account

| Test Case ID    | Mô tả ngắn                 | Kết quả (Pass/Fail) | Bug Id (nếu có) | Ghi chú |
|-----------------|---------------------------|----------------------|-----------------|--------|
| TC-LOGIN-01     | Đăng nhập thành công      |                      |                 |        |
| TC-LOGIN-02     | Đăng nhập sai mật khẩu    |                      |                 |        |
| TC-REGISTER-01  | Đăng ký tài khoản mới     |                      |                 |        |
| TC-ACCOUNT-01   | Bảo vệ route `/account`   |                      |                 |        |

#### 3.2. Danh sách & chi tiết phim

| Test Case ID       | Mô tả ngắn                              | Kết quả | Bug Id | Ghi chú |
|--------------------|------------------------------------------|--------|--------|--------|
| TC-MOVIE-LIST-01   | Xem danh sách phim có phân trang         |        |        |        |
| TC-MOVIE-LIST-02   | Filter phim theo thể loại                |        |        |        |
| TC-MOVIE-DETAIL-01 | Xem chi tiết phim                        |        |        |        |
| TC-MOVIE-WATCH-01  | Trang xem phim & tiếp tục xem            |        |        |        |

#### 3.3. Tương tác phim (Comment/Rating/Like/Watchlist)

| Test Case ID     | Mô tả ngắn                      | Kết quả | Bug Id | Ghi chú |
|------------------|----------------------------------|--------|--------|--------|
| TC-COMMENT-01    | Thêm bình luận cho phim         |        |        |        |
| TC-RATING-01     | Đánh giá phim lần đầu           |        |        |        |
| TC-RATING-02     | Cập nhật rating phim            |        |        |        |
| TC-LIKE-01       | Thích/bỏ thích phim             |        |        |        |
| TC-WATCHLIST-01  | Lưu phim vào watchlist          |        |        |        |
| TC-WATCHLIST-02  | Bỏ lưu phim khỏi watchlist      |        |        |        |

#### 3.4. Recommendation & Account

| Test Case ID  | Mô tả ngắn                                | Kết quả | Bug Id | Ghi chú |
|---------------|--------------------------------------------|--------|--------|--------|
| TC-RECO-01    | Gợi ý cho user có dữ liệu hành vi         |        |        |        |
| TC-RECO-02    | Gợi ý cho user mới (cold-start)           |        |        |        |

#### 3.5. Admin

| Test Case ID        | Mô tả ngắn                                  | Kết quả | Bug Id | Ghi chú |
|---------------------|----------------------------------------------|--------|--------|--------|
| TC-ADMIN-ACCESS-01  | Ngăn truy cập admin bằng user thường        |        |        |        |
| TC-ADMIN-ACCESS-02  | Truy cập admin bằng tài khoản ADMIN         |        |        |        |
| TC-ADMIN-MOVIE-01   | Xem danh sách phim trong trang admin movies |        |        |        |
| TC-ADMIN-STAT-01    | Xem dashboard thống kê                      |        |        |        |

### 4. Danh sách bug chính

> Có thể link sang hệ thống issue tracker nếu đang dùng (Jira, GitHub Issues, v.v.).

| Bug Id  | Mô tả                         | Mức độ (Critical/High/Medium/Low) | Status  | Liên quan test case |
|---------|------------------------------|------------------------------------|---------|----------------------|
| BUG-001 | _[ví dụ: Lỗi redirect login]_ | High                               | Open    | TC-LOGIN-01          |

### 5. Kết luận & đề xuất

- **Kết luận**:
  - _[Ví dụ: “Hệ thống đáp ứng X/Y luồng chính, các lỗi còn lại có thể khắc phục trước buổi demo.”]_
- **Đề xuất**:
  - Ưu tiên fix các bug ảnh hưởng trực tiếp tới:
    - Đăng nhập/đăng ký.
    - Xem phim & tương tác (rating, like, comment).
    - Gợi ý phim.
    - Route và phân quyền admin.

