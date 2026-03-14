# Backend - Movie Recommendation System

## Chạy backend

### Cách 1: Double-click file (đơn giản nhất)

1. **Bật MySQL** (XAMPP: Start MySQL, hoặc MySQL Service).
2. Tạo database (nếu chưa có):
   - Mở phpMyAdmin hoặc MySQL client.
   - Tạo database tên `movie_recommendation`, collation `utf8mb4_unicode_ci`.
3. Trong thư mục `backend`, **double-click `run-backend.bat`**.
4. Cửa sổ CMD mở, đợi đến khi thấy dòng **"Started MovieRecommendationApplication"**.
5. Mở trình duyệt: http://localhost:3000/movies (frontend) hoặc http://localhost:8080/api/movies (API).

### Cách 2: Chạy từ CMD

```cmd
cd d:\Documents_II\N4\N4_HK2\Do_An_2\Do_an_2\backend
run-backend.bat
```

Hoặc chạy JAR trực tiếp (sau khi đã build):

```cmd
cd backend
java -jar target\movierecommendation-0.0.1-SNAPSHOT.jar
```

### Cách 3: Chạy từ IDE

Mở project bằng IntelliJ IDEA hoặc Eclipse, tìm class **`MovieRecommendationApplication`** và chạy (Run).

### Yêu cầu

- **Java 21** (kiểm tra: `java -version`)
- **MySQL**: Khuyến nghị **MySQL 8** (hoặc 5.7). Database tên `movie_recommendation`
- Cấu hình: `src/main/resources/application-dev.yml` (user: root, password: rỗng cho XAMPP)

### Nếu đang dùng MySQL 5.5 (XAMPP cũ) – lỗi "Unsupported Database: MySQL 5.5"

Flyway trong Spring Boot 3 không hỗ trợ MySQL 5.5. Có 2 cách:

**Cách A (khuyến nghị):** Nâng cấp lên **MySQL 8**
- Cài MySQL 8 hoặc dùng XAMPP phiên bản có MySQL 8+, hoặc cài MySQL 8 riêng.

**Cách B:** Chạy tạm với MySQL 5.5 (tắt Flyway, dùng Hibernate tạo bảng):

1. Đặt biến môi trường trước khi chạy:
   ```cmd
   set SPRING_PROFILES_ACTIVE=dev,mysql55
   run-backend.bat
   ```
2. Hoặc chạy JAR với profile:
   ```cmd
   java -jar target\movierecommendation-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev,mysql55
   ```
3. Lần đầu chạy, Hibernate sẽ tạo bảng từ entity. Để có dữ liệu mẫu (thể loại, phim), sau khi backend chạy xong bạn mở phpMyAdmin và chạy lần lượt nội dung các file trong `backend/src/main/resources/db/migration/`: **V2__seed_roles.sql**, **V3__seed_genres.sql**, **V4__seed_movies.sql** (chỉ phần INSERT, bỏ qua CREATE TABLE).
