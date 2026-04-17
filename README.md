# 🎬 Movie Recommendation System

Hệ thống gợi ý phim thông minh - giúp người dùng khám phá phim yêu thích dựa trên thể loại và sở thích cá nhân.

## 🚀 Stack Công Nghệ

| Layer | Công Nghệ |
|-------|-----------|
| **Backend** | Java 21, Spring Boot 3.2.5, Spring Security, JPA/Hibernate |
| **Frontend** | Next.js 14.2.5, React 18.3, TypeScript, React Query, Axios |
| **Database** | MySQL 8.0, Flyway (Migration) |
| **API** | RESTful, OpenAPI/Swagger, JWT Authentication |
| **Deployment** | Docker, Docker Compose |

## 📁 Cấu Trúc Project

```
movie-recommendation-system/
├── backend/                    # Spring Boot API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/          # Application code
│   │   │   └── resources/     # Configs, migrations
│   │   └── test/              # Unit tests
│   ├── pom.xml                # Maven configuration
│   └── Dockerfile             # Docker image
├── frontend/                   # Next.js Application
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   └── features/          # Feature modules
│   ├── package.json           # NPM dependencies
│   └── Dockerfile             # Docker image
├── database/                   # Database utilities
│   ├── migrations/            # SQL migration scripts
│   └── seed/                  # Sample data
├── docs/                       # Documentation
│   ├── resources/             # Tech stack, architecture
│   └── database/              # Database schema
└── docker-compose.yml         # Container orchestration
```

## 🛠️ Yêu Cầu Hệ Thống

### Cách 1: Chạy Local (Khuyến Nghị)
- **Java 21+** - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **MySQL 8.0+** - [Download](https://www.mysql.com/downloads/mysql/)
- **Maven 3.8+** - Usually included with IDE

### Cách 2: Chạy với Docker (Easy Setup)
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)

## 🚀 Hướng Dẫn Cài Đặt & Chạy

### ✅ Cách 1: Docker Compose (Nhanh & Dễ - Khuyến Nghị)

```bash
# Clone project
git clone <repository-url>
cd Do_an_2

# Chạy toàn bộ hệ thống
docker-compose up -d

# Kiểm tra status
docker-compose ps

# View logs
docker-compose logs -f
```

**Địa chỉ truy cập:**
- 🌐 Frontend: http://localhost:3000
- 📚 API Docs: http://localhost:8080/swagger-ui.html
- 🗄️ MySQL: localhost:3306 (user: `root`, password: `root`)

---

### ✅ Cách 2: Chạy Local (Tinh Chỉnh Chi Tiết)

#### 1️⃣ **Setup Database**

```bash
# Bật MySQL service
# Windows: Start MySQL từ Services hoặc XAMPP
# macOS: brew services start mysql@8.0
# Linux: sudo systemctl start mysql

# Tạo database
mysql -u root -p
> CREATE DATABASE movie_recommendation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> EXIT;
```

#### 2️⃣ **Backend Setup & Run**

```bash
# Navigate to backend
cd backend

# Option A: Chạy batch file (Windows)
double-click run-backend.bat

# Option B: Chạy từ command line
mvn clean install
java -jar target/movierecommendation-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev

# Option C: Chạy từ IDE
# - Import project vào IntelliJ IDEA hoặc Eclipse
# - Find class: MovieRecommendationApplication
# - Click Run (Ctrl+F5 hoặc Shift+F10)
```

**Kiểm tra Backend:**
```bash
curl http://localhost:8080/api/movies
# Hoặc mở: http://localhost:8080/swagger-ui.html
```

#### 3️⃣ **Frontend Setup & Run**

```bash
# Navigate to frontend
cd frontend

# Cài dependencies
npm install

# Chạy development server
npm run dev

# Hoặc build & start
npm run build
npm run start
```

**Frontend sẵn sàng tại:** http://localhost:3000

---

## 📋 Các Lệnh Hữu Ích

### Backend

```bash
# Build project
cd backend && mvn clean build

# Run tests
mvn test

# Generate JAR
mvn clean package

# Run with specific profile
java -jar target/movierecommendation-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=dev,mysql55
```

### Frontend

```bash
# Development server
npm run dev

# Production build
npm run build

# Linting & Format
npm run lint
npx prettier --write .
```

### Docker

```bash
# Build & start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Remove volumes (⚠️ sẽ xoá dữ liệu database)
docker-compose down -v
```

---

## 🔐 Cấu Hình & Biến Môi Trường

### Backend (`backend/src/main/resources/application-dev.yml`)

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/movie_recommendation
    username: root
    password: # (để trống nếu dùng XAMPP)
  jpa:
    hibernate:
      ddl-auto: validate
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 🎯 Features

✅ **User Management**
- User registration & login
- JWT authentication
- Role-based access control (Admin, User)

✅ **Movie Catalog**
- Browse movies by genre
- Search functionality
- Movie details & ratings

✅ **Recommendation Engine**
- Personalized recommendations
- Genre-based filtering
- User preference tracking

✅ **Admin Panel**
- Manage movies & genres
- User management
- System analytics

---

## 📚 Tài Liệu

- **[Tech Stack](docs/resources/tech_stack.md)** - Chi tiết công nghệ
- **[Project Structure](docs/resources/project_structure.md)** - Cấu trúc dự án
- **[API Documentation](http://localhost:8080/swagger-ui.html)** - Swagger UI (khi backend chạy)
- **[Database Schema](docs/database/)** - ERD & SQL scripts

---

## ⚠️ Troubleshooting

### ❌ Lỗi: "Unsupported Database: MySQL 5.5"

**Nguyên nhân:** Flyway không hỗ trợ MySQL < 5.7

**Giải pháp:**
```bash
# Option 1: Nâng cấp MySQL 8
# Download MySQL 8: https://dev.mysql.com/downloads/mysql/

# Option 2: Tạm dùng MySQL 5.5 (tắt Flyway)
set SPRING_PROFILES_ACTIVE=dev,mysql55
run-backend.bat
```

### ❌ Lỗi: "Connection refused: localhost:3306"

**Giải pháp:**
```bash
# Kiểm tra MySQL đang chạy
mysql -u root -p

# Windows: Bật MySQL từ XAMPP/Services
# macOS: brew services start mysql@8.0
# Linux: sudo systemctl start mysql
```

### ❌ Docker: "Port 3000 already in use"

```bash
# Xem process sử dụng port
# Windows: netstat -ano | findstr :3000
# macOS: lsof -i :3000
# Linux: lsof -i :3000

# Kill process hoặc dùng port khác
docker-compose -e "PORT=3001" up
```

---

## 👥 Quy Ước Phát Triển

### Backend
- **Package Structure:** Feature-first (`auth`, `user`, `movie`, `genre`)
- **Response Format:** Luôn bọc qua `BaseResponse`
- **DTO:** Sử dụng DTO cho API requests/responses
- **Security:** JWT + Spring Security

### Frontend
- **Component:** Server Component by default
- **Folder Structure:** `src/features/*` theo domain
- **API Client:** React Query + Axios
- **Styling:** Tailwind CSS (if configured)

---

## 📞 Support & Contact

- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation:** Xem folder `docs/`
- **Questions:** Tham khảo `AGENTS.md` để hiểu quy tắc phát triển

---

## 📄 License

Dự án này là bài tập đồ án. Xin vui lòng liên hệ để biết thêm chi tiết.

---

**Happy Coding! 🚀**

Last Updated: 2026-04-18
