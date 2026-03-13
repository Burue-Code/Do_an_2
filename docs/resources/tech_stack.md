# Tech Stack – Hệ thống gợi ý phim

Tài liệu này cố định công nghệ sử dụng cho toàn bộ hệ thống, làm chuẩn cho thiết kế, triển khai và báo cáo đồ án.

---

## 1. Kiến trúc tổng thể

- **Mô hình**: Web Application, kiến trúc client–server, backend REST API + frontend SPA/SSR.  
- **Tổ chức source**: **Monorepo** gồm các thành phần:
  - `backend/`: Spring Boot API.
  - `frontend/`: Next.js App Router.
  - `database/`: migration, seed, backup.
  - `docs/`: tài liệu SRS, ERD, Use Case, diagram.
  - `.ai/`: context & prompt hỗ trợ coding bằng AI (Cursor, Copilot, ChatGPT, v.v.).

---

## 2. Backend

- **Ngôn ngữ**: **Java 21**.  
- **Framework**: **Spring Boot 3.x**.  
- **Kiểu kiến trúc**:
  - **Feature-first** theo domain: `auth/`, `user/`, `movie/`, `genre/`, `comment/`, `rating/`, `like/`, `watchlist/`, `watchhistory/`, `search/`, `recommendation/`, `admin/`...
  - Phân lớp rõ: `controller`, `service`, `service impl`, `entity`, `repository`, `dto`, `mapper`, `specification` nếu cần.
- **ORM / Persistence**:
  - **Spring Data JPA + Hibernate**.
  - Mapping theo ERD: `USERS`, `ROLE`, `GENRE`, `USERS_GENRE`, `MOVIES`, `MOVIES_GENRE`, `EPISODES`, `WATCH_LOGS`, `COMMENTS`, `RATINGS`, `LIKES`, `WATCHLIST_ITEMS`, `SEARCH_HISTORY`, `SCHEDULES`, `ACTORS`, `DIRECTORS`, `MOVIES_ACTORS`, `MOVIES_DIRECTORS`...
- **Migration database**:
  - **Flyway** với các file `V1__init_schema.sql`, `V2__seed_roles.sql`, `V3__seed_genres.sql`, `V4__seed_admin.sql`, `V5__seed_movies.sql`, `V6__seed_episodes.sql`, `V7__create_indexes.sql`, v.v.
- **Bảo mật / Auth**:
  - **Spring Security 6 (thuộc Spring Boot 3)**.
  - Cơ chế auth: **JWT** (Bearer token) hoặc **HttpOnly Cookie Session** (ưu tiên 1 trong 2, thiết kế để có thể chuyển đổi).
  - Các thành phần chính:
    - `SecurityConfig`, `JwtAuthenticationFilter`, `JwtTokenProvider`, `CustomUserDetailsService`, `PasswordConfig`, `AuthEntryPointJwt`.
- **Mẫu trả về API**:
  - Sử dụng DTO cho mọi request/response.
  - Không expose trực tiếp entity JPA ra controller.
  - Có lớp response chung: `BaseResponse`, `PageResponse`, `ApiMessage`.
- **Mapping / Utility**:
  - Mapper: MapStruct hoặc mapper thủ công, gom trong package `mapper`.
  - Tiện ích chung: `SlugUtils`, `DateTimeUtils`, `JsonUtils`, `FileUtils`...
- **Documentation API**:
  - **OpenAPI/Swagger** (ví dụ springdoc-openapi), file chuẩn hóa `docs/openapi.yaml`.

---

## 3. Frontend

- **Ngôn ngữ**: **TypeScript**.  
- **Framework**: **Next.js 14/15 – App Router**.  
- **Kiểu component**:
  - **Server Component** mặc định.
  - Client Component chỉ khi cần state, effect, event tương tác (form, player, like button, v.v.).
- **Quản lý dữ liệu / gọi API**:
  - Sử dụng **React Query** (hoặc TanStack Query) cho mọi API call bất đồng bộ.
  - Gói hóa theo feature trong `src/features/*` (`auth`, `movie`, `recommendation`, `comment`, `rating`, `watch-history`, `watchlist`, `admin`...).
  - HTTP client: `axios` cấu hình trong `src/lib/axios.ts` (baseURL, interceptor, attach token/cookie).
- **Routing**:
  - Sử dụng App Router (`src/app/`) cho các route:
    - Công khai: `/`, `/movies`, `/movies/[slug]`, `/movies/[slug]/watch`, `/genres`, `/top`, `/high-rated`, `/now-showing`, `/completed`, `/schedules`.
    - Cần đăng nhập: `/account`, `/account/history`, `/account/watchlist`, `/account/liked`, `/account/preferences`, `/recommendations`.
    - Admin: `/admin/movies`, `/admin/genres`, `/admin/users`, `/admin/schedules`, `/admin/actors`, `/admin/directors`, `/admin/episodes`, `/admin/statistics`.
- **UI / Component**:
  - Thư mục `src/components/` chia theo:
    - `ui/`: button, input, dialog, select, textarea, badge, pagination, skeleton, tabs, toast...
    - `layout/`: header, footer, sidebar, admin-sidebar...
    - `movie/`: movie-card, movie-grid, movie-detail, video-player, continue-watching-card, rating-stars, like-button, watchlist-button, comment-list...
    - `admin/`: movie-form, genre-form, user-table, schedule-form, statistics-chart...
- **Form & validation**:
  - Sử dụng **zod** (hoặc thư viện tương đương) cho validate form phía frontend.
- **Quản lý trạng thái / hooks dùng lại**:
  - `src/hooks/`: `use-auth`, `use-debounce`, `use-pagination`, `use-video-progress`, `use-role-guard`...
  - Provider: `query-provider`, `theme-provider`, `auth-provider`.

---

## 4. Database & Storage

- **Hệ quản trị CSDL**: **MySQL 8.x**.  
- **Mô hình dữ liệu**:
  - Thiết kế theo **ERD** trong `erd.plantuml`, đảm bảo:
    - Quan hệ 1-n, n-n được tách qua bảng liên kết.
    - Hỗ trợ đầy đủ: user, role, movie, genre, lịch chiếu, tập phim, lịch sử xem, like, rating, watchlist, search history, diễn viên, đạo diễn.
- **Chuẩn hóa dữ liệu**:
  - Bảng thể loại (`GENRE`) được seed dữ liệu mặc định (Hành động, Tình cảm, Kinh dị, Hài, Hoạt hình, Khoa học viễn tưởng, Phiêu lưu, Tâm lý...).
  - Tài khoản admin mặc định tạo bằng migration.
- **Storage media**:
  - Mặc định: lưu file trên **local storage** (poster, thumbnail, phụ đề, video nếu cần demo).
  - Có khả năng mở rộng sang **S3-compatible storage** (MinIO, Amazon S3) qua `FileStorageService`, `LocalFileStorageService`, `S3FileStorageService`.

---

## 5. Hạ tầng & Triển khai

- **Docker**:
  - `docker-compose.yml` để chạy:
    - Backend Spring Boot.
    - Frontend Next.js.
    - MySQL 8.
  - Mỗi service có `Dockerfile` riêng (ít nhất backend, frontend).
- **Cấu hình môi trường**:
  - Sử dụng file `.env` và `.env.example` cho các biến:
    - DB URL, user, password.
    - JWT secret, token expiration.
    - Backend base URL cho frontend.
  - Phân tách cấu hình theo môi trường:
    - `application-dev.yml`, `application-prod.yml` (Spring Boot).
    - `.env.development.local`, `.env.production` (Next.js) nếu cần.

---

## 6. Quy ước & Nguyên tắc coding

- **Ngôn ngữ trong code**:  
  - Tên class, biến, method: **Tiếng Anh**.  
  - Tài liệu, mô tả, báo cáo: có thể dùng **Tiếng Việt**.
- **Backend**:
  - Dùng **constructor injection**.
  - Controller mỏng, business logic đặt trong Service.
  - Luôn dùng DTO, không trả trực tiếp entity JPA ra ngoài.
  - Response thống nhất qua `BaseResponse` / `PageResponse`.
  - Mỗi thay đổi schema đều phải đi qua **Flyway migration**.
  - Không gộp endpoint admin và public trong cùng 1 controller nếu tránh được.
- **Frontend**:
  - Ưu tiên Server Component; Client Component khi cần tương tác/phản hồi thời gian thực.
  - Tất cả việc fetch dữ liệu từ backend phải qua **React Query** hoặc layer `features/*/api.ts`.
  - Route, component, hook nên tổ chức theo **feature** để bám sát domain (auth, movie, recommendation...).

---

## 7. Khung recommendation (gợi ý phim)

- **Giai đoạn đầu**: Sử dụng **rule-based, không dùng ML phức tạp**.  
- **Nguồn dữ liệu đầu vào**:
  - Thể loại yêu thích: `USERS_GENRE`.
  - Lịch sử xem: `WATCH_LOGS`.
  - Lượt thích: `LIKES`.
  - Đánh giá: `RATINGS`.
  - Độ phổ biến / trending: thống kê từ `WATCH_LOGS`, `RATINGS`, `LIKES`.
- **Ý tưởng công thức điểm gợi ý** (tham khảo):

  \[
  \text{score} =
    0.40 * \text{genre\_match} +
    0.25 * \text{watch\_history} +
    0.20 * \text{like} +
    0.10 * \text{rating} +
    0.05 * \text{trending}
  \]

- **Triển khai**:
  - Các service/strategy trong module `recommendation/`:
    - `RecommendationService`, `RecommendationServiceImpl`.
    - `RecommendationScoringService`, `RecommendationScoringServiceImpl`.
    - `RecommendationFallbackService`, `RecommendationFallbackServiceImpl`.
    - `GenreBasedRecommendationStrategy`, `HistoryBasedRecommendationStrategy`, `PopularMovieFallbackStrategy`, `HybridRecommendationStrategy`.

---

## 8. Tài liệu & Hỗ trợ AI

- **Tài liệu kỹ thuật**:
  - `project_structure.md`: cấu trúc chi tiết backend, frontend, database, AI hỗ trợ coding.
  - `erd.plantuml`: ERD chính thức của hệ thống.
  - `use_case.plantuml`: Use Case tổng quan.
  - `srs.md`: SRS – đặc tả yêu cầu phần mềm.
- **Hỗ trợ AI (vibe coding)**:
  - Thư mục `.ai/` gồm:
    - `context/`: domain overview, erd-summary, api-contracts, coding-conventions, backend-rules, frontend-rules.
    - `prompts/`: các prompt mẫu để sinh code Spring Boot, Next.js, CRUD, entity, hook React Query.
    - `tasks/`: kế hoạch theo pha (auth, movie, interaction, recommendation, admin).
    - `checklists/`: checklist cho backend feature, frontend page, release.
  - File `AGENTS.md` mô tả ngắn gọn project và rule cho AI.
  - File `.cursorrules` cố định quy tắc coding khi làm việc với Cursor.

---

Tất cả các thành phần mới của hệ thống (feature backend, page frontend, thay đổi DB) **phải tuân theo tech stack và quy ước trong tài liệu này**, trừ khi có cập nhật chính thức kèm giải thích trong tài liệu mới hơn.

