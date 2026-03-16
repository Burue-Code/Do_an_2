# Thiết kế cơ sở dữ liệu – Hệ thống gợi ý phim

Thư mục này mô tả **thiết kế cơ sở dữ liệu MySQL** cho hệ thống gợi ý phim theo thể loại, được xây dựng dựa trên:

- ERD: `docs/resources/erd.plantuml`
- SRS: `docs/resources/srs.md`
- Tech stack: `docs/resources/tech_stack.md`

---

## 1. Công nghệ và nguyên tắc chung

- **Hệ quản trị CSDL**: MySQL 8.x  
- **Cú pháp**: InnoDB, UTF8MB4, engine hỗ trợ foreign key  
- **Chuẩn hóa**: dùng bảng liên kết cho quan hệ nhiều–nhiều (movie–genre, movie–actor, movie–director, user–genre, watchlist)  
- **Migration production**: dùng Flyway trong thư mục `backend/src/main/resources/db/migration/`  
- **Thư mục tài liệu**:
  - `schema_mysql.sql`: script tạo toàn bộ bảng.
  - `migrations/`: bản thô các file migration chính, tương ứng với thiết kế.

---

## 2. Danh sách bảng chính

- **Người dùng & quyền**:
  - `roles`
  - `users`
  - `users_genre` (thể loại yêu thích của user)

- **Phim & nội dung**:
  - `genres`
  - `movies`
  - `movies_genre`
  - `episodes`
  - `schedules`

- **Diễn viên, đạo diễn**:
  - `actors`
  - `movies_actors`
  - `directors`
  - `movies_directors`

- **Tương tác & cá nhân hóa**:
  - `comments`
  - `ratings`
  - `likes`
  - `watch_logs`
  - `watchlist_items`
  - `search_history`

---

## 3. File schema

- **`schema_mysql.sql`**:  
  - Dùng để:
    - Khởi tạo database nhanh trong môi trường dev/demo.
    - Tham khảo khi viết Flyway migration thực tế trong backend.
  - Bao gồm:
    - Tạo database (tùy chọn).
    - Tạo bảng theo đúng ERD.
    - Định nghĩa PK, FK, chỉ mục cơ bản.

---

## 4. Migrations tham khảo

Thư mục `migrations/` chứa các file mẫu:

- `V1__init_schema.sql`: tạo toàn bộ bảng và khóa.
- `V2__seed_roles.sql`: seed ROLE_ADMIN, ROLE_USER.
- `V3__seed_genres.sql`: seed các thể loại phim phổ biến.
- `V4__seed_admin.sql`: tạo tài khoản admin mặc định.

Các file này là **tài liệu tham khảo**; khi triển khai thực tế, code backend sẽ có bản migration tương ứng trong thư mục chuẩn của Flyway.

