# Thiết kế cấu trúc dự án chi tiết theo stack Spring Boot + Next.js + MySQL

Tài liệu này mô tả **cấu trúc dự án chi tiết đến từng thư mục và file chính** cho hệ thống:

**Hệ thống gợi ý phim yêu thích của người dùng thông qua thể loại phim**

Stack công nghệ:
- **Backend:** Java 21, Spring Boot 3.x
- **Frontend:** Next.js 14/15 (App Router), TypeScript
- **Database:** MySQL 8
- **Auth:** JWT hoặc HttpOnly Cookie Session
- **ORM:** Spring Data JPA + Hibernate
- **Migration:** Flyway
- **Storage media:** local/S3-compatible tùy môi trường
- **Realtime/polling:** REST trước, có thể mở rộng WebSocket sau

---

# 1. Kiến trúc tổng thể

Nên tổ chức theo **monorepo** để dễ quản lý đồng bộ frontend, backend, tài liệu, database và prompt hỗ trợ vibe coding.

```text
movie-recommendation-system/
├─ backend/                     # Spring Boot API
├─ frontend/                    # Next.js App Router
├─ database/                    # schema, migration, seed, backup script
├─ docs/                        # SRS, ERD, use case, sequence, activity
├─ .ai/                         # prompt, context, planning cho vibe coding
├─ scripts/                     # script dev/build/deploy/check
├─ docker-compose.yml
├─ .env.example
├─ README.md
├─ AGENTS.md
└─ .cursorrules
```

---

# 2. Cấu trúc backend Spring Boot chi tiết

## 2.1. Nguyên tắc tổ chức backend

Backend nên tổ chức theo hướng **feature-first** thay vì chỉ chia theo `controller/service/repository` toàn cục.  
Cách này rất phù hợp khi hệ thống có nhiều chức năng như:
- đăng nhập/đăng ký
- phim
- thể loại
- bình luận
- đánh giá
- lịch sử xem
- gợi ý phim
- quản trị

Mỗi module feature sẽ tự chứa:
- controller
- service
- dto
- entity
- repository
- mapper
- specification/query nếu cần

---

## 2.2. Cây thư mục backend đề xuất

```text
backend/
├─ pom.xml
├─ mvnw
├─ mvnw.cmd
├─ .env.example
├─ Dockerfile
├─ src/
│  ├─ main/
│  │  ├─ java/com/example/movierecommendation/
│  │  │  ├─ MovieRecommendationApplication.java
│  │  │  │
│  │  │  ├─ config/
│  │  │  │  ├─ AppConfig.java
│  │  │  │  ├─ CorsConfig.java
│  │  │  │  ├─ JacksonConfig.java
│  │  │  │  ├─ OpenApiConfig.java
│  │  │  │  ├─ WebMvcConfig.java
│  │  │  │  └─ AsyncConfig.java
│  │  │  │
│  │  │  ├─ security/
│  │  │  │  ├─ SecurityConfig.java
│  │  │  │  ├─ JwtAuthenticationFilter.java
│  │  │  │  ├─ JwtTokenProvider.java
│  │  │  │  ├─ CustomUserDetailsService.java
│  │  │  │  ├─ CustomUserDetails.java
│  │  │  │  ├─ AuthEntryPointJwt.java
│  │  │  │  ├─ PasswordConfig.java
│  │  │  │  └─ SecurityUtils.java
│  │  │  │
│  │  │  ├─ common/
│  │  │  │  ├─ base/
│  │  │  │  │  ├─ BaseEntity.java
│  │  │  │  │  ├─ BaseResponse.java
│  │  │  │  │  ├─ PageResponse.java
│  │  │  │  │  └─ ApiMessage.java
│  │  │  │  ├─ constant/
│  │  │  │  │  ├─ RoleName.java
│  │  │  │  │  ├─ MovieStatus.java
│  │  │  │  │  ├─ MovieType.java
│  │  │  │  │  ├─ SortDirection.java
│  │  │  │  │  └─ ErrorCode.java
│  │  │  │  ├─ exception/
│  │  │  │  │  ├─ GlobalExceptionHandler.java
│  │  │  │  │  ├─ ResourceNotFoundException.java
│  │  │  │  │  ├─ BusinessException.java
│  │  │  │  │  ├─ UnauthorizedException.java
│  │  │  │  │  └─ ValidationException.java
│  │  │  │  ├─ util/
│  │  │  │  │  ├─ SlugUtils.java
│  │  │  │  │  ├─ DateTimeUtils.java
│  │  │  │  │  ├─ JsonUtils.java
│  │  │  │  │  └─ FileUtils.java
│  │  │  │  ├─ validator/
│  │  │  │  │  ├─ StrongPassword.java
│  │  │  │  │  └─ StrongPasswordValidator.java
│  │  │  │  └─ mapper/
│  │  │  │     └─ CommonMapperConfig.java
│  │  │  │
│  │  │  ├─ auth/
│  │  │  │  ├─ controller/
│  │  │  │  │  └─ AuthController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ AuthService.java
│  │  │  │  │  └─ AuthServiceImpl.java
│  │  │  │  ├─ dto/
│  │  │  │  │  ├─ LoginRequest.java
│  │  │  │  │  ├─ RegisterRequest.java
│  │  │  │  │  ├─ AuthResponse.java
│  │  │  │  │  ├─ RefreshTokenRequest.java
│  │  │  │  │  └─ ChangePasswordRequest.java
│  │  │  │  └─ mapper/
│  │  │  │     └─ AuthMapper.java
│  │  │  │
│  │  │  ├─ user/
│  │  │  │  ├─ controller/
│  │  │  │  │  └─ UserController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ UserService.java
│  │  │  │  │  └─ UserServiceImpl.java
│  │  │  │  ├─ entity/
│  │  │  │  │  └─ User.java
│  │  │  │  ├─ repository/
│  │  │  │  │  └─ UserRepository.java
│  │  │  │  ├─ dto/
│  │  │  │  │  ├─ UserProfileResponse.java
│  │  │  │  │  ├─ UpdateProfileRequest.java
│  │  │  │  │  ├─ UpdateFavoriteGenresRequest.java
│  │  │  │  │  └─ UserSummaryResponse.java
│  │  │  │  ├─ mapper/
│  │  │  │  │  └─ UserMapper.java
│  │  │  │  └─ specification/
│  │  │  │     └─ UserSpecification.java
│  │  │  │
│  │  │  ├─ role/
│  │  │  │  ├─ entity/
│  │  │  │  │  └─ Role.java
│  │  │  │  └─ repository/
│  │  │  │     └─ RoleRepository.java
│  │  │  │
│  │  │  ├─ genre/
│  │  │  │  ├─ controller/
│  │  │  │  │  ├─ GenreController.java
│  │  │  │  │  └─ AdminGenreController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ GenreService.java
│  │  │  │  │  └─ GenreServiceImpl.java
│  │  │  │  ├─ entity/
│  │  │  │  │  ├─ Genre.java
│  │  │  │  │  └─ UserGenre.java
│  │  │  │  ├─ repository/
│  │  │  │  │  ├─ GenreRepository.java
│  │  │  │  │  └─ UserGenreRepository.java
│  │  │  │  ├─ dto/
│  │  │  │  │  ├─ GenreResponse.java
│  │  │  │  │  ├─ CreateGenreRequest.java
│  │  │  │  │  └─ UpdateGenreRequest.java
│  │  │  │  └─ mapper/
│  │  │  │     └─ GenreMapper.java
│  │  │  │
│  │  │  ├─ movie/
│  │  │  │  ├─ controller/
│  │  │  │  │  ├─ MovieController.java
│  │  │  │  │  ├─ PublicMovieController.java
│  │  │  │  │  └─ AdminMovieController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ MovieService.java
│  │  │  │  │  ├─ MovieQueryService.java
│  │  │  │  │  ├─ MovieAdminService.java
│  │  │  │  │  ├─ MovieServiceImpl.java
│  │  │  │  │  ├─ MovieQueryServiceImpl.java
│  │  │  │  │  └─ MovieAdminServiceImpl.java
│  │  │  │  ├─ entity/
│  │  │  │  │  ├─ Movie.java
│  │  │  │  │  ├─ MovieGenre.java
│  │  │  │  │  ├─ MovieActor.java
│  │  │  │  │  └─ MovieDirector.java
│  │  │  │  ├─ repository/
│  │  │  │  │  ├─ MovieRepository.java
│  │  │  │  │  ├─ MovieGenreRepository.java
│  │  │  │  │  ├─ MovieActorRepository.java
│  │  │  │  │  └─ MovieDirectorRepository.java
│  │  │  │  ├─ dto/
│  │  │  │  │  ├─ MovieListResponse.java
│  │  │  │  │  ├─ MovieDetailResponse.java
│  │  │  │  │  ├─ CreateMovieRequest.java
│  │  │  │  │  ├─ UpdateMovieRequest.java
│  │  │  │  │  ├─ MovieSearchRequest.java
│  │  │  │  │  ├─ AssignGenresRequest.java
│  │  │  │  │  └─ MovieCardResponse.java
│  │  │  │  ├─ mapper/
│  │  │  │  │  └─ MovieMapper.java
│  │  │  │  └─ specification/
│  │  │  │     └─ MovieSpecification.java
│  │  │  │
│  │  │  ├─ actor/
│  │  │  │  ├─ controller/
│  │  │  │  │  └─ AdminActorController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ ActorService.java
│  │  │  │  │  └─ ActorServiceImpl.java
│  │  │  │  ├─ entity/
│  │  │  │  │  └─ Actor.java
│  │  │  │  ├─ repository/
│  │  │  │  │  └─ ActorRepository.java
│  │  │  │  ├─ dto/
│  │  │  │  │  ├─ ActorResponse.java
│  │  │  │  │  ├─ CreateActorRequest.java
│  │  │  │  │  └─ UpdateActorRequest.java
│  │  │  │  └─ mapper/
│  │  │  │     └─ ActorMapper.java
│  │  │  │
│  │  │  ├─ director/
│  │  │  │  ├─ controller/
│  │  │  │  │  └─ AdminDirectorController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ DirectorService.java
│  │  │  │  │  └─ DirectorServiceImpl.java
│  │  │  │  ├─ entity/
│  │  │  │  │  └─ Director.java
│  │  │  │  ├─ repository/
│  │  │  │  │  └─ DirectorRepository.java
│  │  │  │  ├─ dto/
│  │  │  │  │  ├─ DirectorResponse.java
│  │  │  │  │  ├─ CreateDirectorRequest.java
│  │  │  │  │  └─ UpdateDirectorRequest.java
│  │  │  │  └─ mapper/
│  │  │  │     └─ DirectorMapper.java
│  │  │  │
│  │  │  ├─ episode/
│  │  │  │  ├─ controller/
│  │  │  │  │  ├─ EpisodeController.java
│  │  │  │  │  └─ AdminEpisodeController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ EpisodeService.java
│  │  │  │  │  └─ EpisodeServiceImpl.java
│  │  │  │  ├─ entity/
│  │  │  │  │  └─ Episode.java
│  │  │  │  ├─ repository/
│  │  │  │  │  └─ EpisodeRepository.java
│  │  │  │  ├─ dto/
│  │  │  │  │  ├─ EpisodeResponse.java
│  │  │  │  │  ├─ CreateEpisodeRequest.java
│  │  │  │  │  └─ UpdateEpisodeRequest.java
│  │  │  │  └─ mapper/
│  │  │  │     └─ EpisodeMapper.java
│  │  │  │
│  │  │  ├─ schedule/
│  │  │  │  ├─ controller/
│  │  │  │  │  ├─ ScheduleController.java
│  │  │  │  │  └─ AdminScheduleController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ ScheduleService.java
│  │  │  │  │  └─ ScheduleServiceImpl.java
│  │  │  │  ├─ entity/
│  │  │  │  │  └─ Schedule.java
│  │  │  │  ├─ repository/
│  │  │  │  │  └─ ScheduleRepository.java
│  │  │  │  ├─ dto/
│  │  │  │  │  ├─ ScheduleResponse.java
│  │  │  │  │  ├─ CreateScheduleRequest.java
│  │  │  │  │  └─ UpdateScheduleRequest.java
│  │  │  │  └─ mapper/
│  │  │  │     └─ ScheduleMapper.java
│  │  │  │
│  │  │  ├─ comment/
│  │  │  │  ├─ controller/
│  │  │  │  │  └─ CommentController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ CommentService.java
│  │  │  │  │  └─ CommentServiceImpl.java
│  │  │  │  ├─ entity/
│  │  │  │  │  └─ Comment.java
│  │  │  │  ├─ repository/
│  │  │  │  │  └─ CommentRepository.java
│  │  │  │  ├─ dto/
│  │  │  │  │  ├─ CreateCommentRequest.java
│  │  │  │  │  ├─ CommentResponse.java
│  │  │  │  │  └─ UpdateCommentRequest.java
│  │  │  │  └─ mapper/
│  │  │  │     └─ CommentMapper.java
│  │  │  │
│  │  │  ├─ rating/
│  │  │  │  ├─ controller/
│  │  │  │  │  └─ RatingController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ RatingService.java
│  │  │  │  │  └─ RatingServiceImpl.java
│  │  │  │  ├─ entity/
│  │  │  │  │  └─ Rating.java
│  │  │  │  ├─ repository/
│  │  │  │  │  └─ RatingRepository.java
│  │  │  │  ├─ dto/
│  │  │  │  │  ├─ RateMovieRequest.java
│  │  │  │  │  └─ RatingSummaryResponse.java
│  │  │  │  └─ mapper/
│  │  │  │     └─ RatingMapper.java
│  │  │  │
│  │  │  ├─ like/
│  │  │  │  ├─ controller/
│  │  │  │  │  └─ LikeController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ LikeService.java
│  │  │  │  │  └─ LikeServiceImpl.java
│  │  │  │  ├─ entity/
│  │  │  │  │  └─ MovieLike.java
│  │  │  │  ├─ repository/
│  │  │  │  │  └─ MovieLikeRepository.java
│  │  │  │  └─ dto/
│  │  │  │     └─ ToggleLikeResponse.java
│  │  │  │
│  │  │  ├─ watchlist/
│  │  │  │  ├─ controller/
│  │  │  │  │  └─ WatchlistController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ WatchlistService.java
│  │  │  │  │  └─ WatchlistServiceImpl.java
│  │  │  │  ├─ entity/
│  │  │  │  │  └─ WatchlistItem.java
│  │  │  │  ├─ repository/
│  │  │  │  │  └─ WatchlistRepository.java
│  │  │  │  └─ dto/
│  │  │  │     ├─ WatchlistResponse.java
│  │  │  │     └─ ToggleWatchlistRequest.java
│  │  │  │
│  │  │  ├─ watchhistory/
│  │  │  │  ├─ controller/
│  │  │  │  │  └─ WatchHistoryController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ WatchHistoryService.java
│  │  │  │  │  └─ WatchHistoryServiceImpl.java
│  │  │  │  ├─ entity/
│  │  │  │  │  └─ WatchLog.java
│  │  │  │  ├─ repository/
│  │  │  │  │  └─ WatchLogRepository.java
│  │  │  │  ├─ dto/
│  │  │  │  │  ├─ SaveWatchProgressRequest.java
│  │  │  │  │  ├─ WatchHistoryResponse.java
│  │  │  │  │  └─ ContinueWatchingResponse.java
│  │  │  │  └─ mapper/
│  │  │  │     └─ WatchHistoryMapper.java
│  │  │  │
│  │  │  ├─ search/
│  │  │  │  ├─ controller/
│  │  │  │  │  └─ SearchController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ SearchService.java
│  │  │  │  │  └─ SearchServiceImpl.java
│  │  │  │  ├─ entity/
│  │  │  │  │  └─ SearchHistory.java
│  │  │  │  ├─ repository/
│  │  │  │  │  └─ SearchHistoryRepository.java
│  │  │  │  └─ dto/
│  │  │  │     ├─ SearchMovieRequest.java
│  │  │  │     └─ SearchSuggestionResponse.java
│  │  │  │
│  │  │  ├─ recommendation/
│  │  │  │  ├─ controller/
│  │  │  │  │  └─ RecommendationController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ RecommendationService.java
│  │  │  │  │  ├─ RecommendationScoringService.java
│  │  │  │  │  ├─ RecommendationFallbackService.java
│  │  │  │  │  ├─ RecommendationServiceImpl.java
│  │  │  │  │  ├─ RecommendationScoringServiceImpl.java
│  │  │  │  │  └─ RecommendationFallbackServiceImpl.java
│  │  │  │  ├─ dto/
│  │  │  │  │  ├─ RecommendationResponse.java
│  │  │  │  │  ├─ RecommendationItem.java
│  │  │  │  │  └─ UserPreferenceSnapshot.java
│  │  │  │  └─ strategy/
│  │  │  │     ├─ GenreBasedRecommendationStrategy.java
│  │  │  │     ├─ HistoryBasedRecommendationStrategy.java
│  │  │  │     ├─ PopularMovieFallbackStrategy.java
│  │  │  │     └─ HybridRecommendationStrategy.java
│  │  │  │
│  │  │  ├─ dashboard/
│  │  │  │  ├─ controller/
│  │  │  │  │  └─ AdminDashboardController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ DashboardService.java
│  │  │  │  │  └─ DashboardServiceImpl.java
│  │  │  │  └─ dto/
│  │  │  │     ├─ DashboardOverviewResponse.java
│  │  │  │     ├─ TrendingMovieResponse.java
│  │  │  │     └─ GenreStatisticResponse.java
│  │  │  │
│  │  │  ├─ media/
│  │  │  │  ├─ controller/
│  │  │  │  │  └─ UploadController.java
│  │  │  │  ├─ service/
│  │  │  │  │  ├─ FileStorageService.java
│  │  │  │  │  ├─ LocalFileStorageService.java
│  │  │  │  │  └─ S3FileStorageService.java
│  │  │  │  └─ dto/
│  │  │  │     └─ UploadResponse.java
│  │  │  │
│  │  │  └─ seed/
│  │  │     ├─ DataSeeder.java
│  │  │     └─ SeedProperties.java
│  │  │
│  │  └─ resources/
│  │     ├─ application.yml
│  │     ├─ application-dev.yml
│  │     ├─ application-prod.yml
│  │     ├─ db/migration/
│  │     │  ├─ V1__init_schema.sql
│  │     │  ├─ V2__seed_roles.sql
│  │     │  ├─ V3__seed_genres.sql
│  │     │  ├─ V4__create_indexes.sql
│  │     │  ├─ V5__add_watchlist.sql
│  │     │  └─ V6__add_recommendation_support.sql
│  │     ├─ static/
│  │     └─ logback-spring.xml
│  │
│  └─ test/
│     ├─ java/com/example/movierecommendation/
│     │  ├─ auth/
│     │  ├─ movie/
│     │  ├─ recommendation/
│     │  ├─ watchhistory/
│     │  └─ integration/
│     └─ resources/
│        └─ application-test.yml
└─ docs/
   └─ openapi.yaml
```

---

# 3. Giải thích chi tiết vai trò của từng phần backend

## 3.1. `config/`

Chứa cấu hình kỹ thuật toàn hệ thống.

- `AppConfig.java`: khai báo bean dùng chung
- `CorsConfig.java`: cho phép frontend Next.js gọi API
- `JacksonConfig.java`: format JSON, LocalDateTime
- `OpenApiConfig.java`: cấu hình Swagger/OpenAPI
- `WebMvcConfig.java`: interceptor, formatter
- `AsyncConfig.java`: cấu hình thread pool cho xử lý nền

---

## 3.2. `security/`

Chứa toàn bộ logic xác thực và phân quyền.

- `SecurityConfig.java`: khai báo filter chain, authorize rule
- `JwtAuthenticationFilter.java`: đọc JWT từ header hoặc cookie
- `JwtTokenProvider.java`: tạo và xác thực token
- `CustomUserDetailsService.java`: nạp user từ DB
- `AuthEntryPointJwt.java`: xử lý lỗi 401
- `PasswordConfig.java`: cấu hình BCryptPasswordEncoder
- `SecurityUtils.java`: lấy user hiện tại từ SecurityContext

Nếu bạn dùng **HttpOnly Cookie** thay vì Bearer Token thuần, phần này vẫn giữ được, chỉ cần đổi nơi lưu token.

---

## 3.3. `common/`

Phần dùng chung cho mọi module.

### `base/`
- `BaseEntity.java`: id, createdAt, updatedAt, deletedAt nếu soft delete
- `BaseResponse.java`: format API thống nhất
- `PageResponse.java`: dữ liệu phân trang
- `ApiMessage.java`: hằng text phản hồi

### `constant/`
- enum và constant toàn hệ thống
- ví dụ `MovieStatus`, `RoleName`, `MovieType`

### `exception/`
- gom toàn bộ exception custom
- `GlobalExceptionHandler.java` để trả lỗi đồng nhất

### `util/`
- hàm hỗ trợ slug, datetime, file, json

### `validator/`
- custom annotation như mật khẩu mạnh

---

# 4. Thiết kế từng module chức năng backend

## 4.1. Module `auth`

### Chức năng
- đăng ký
- đăng nhập
- đăng xuất
- refresh token
- đổi mật khẩu

### File chính
- `AuthController.java`: REST API `/api/auth/*`
- `AuthService.java`: interface nghiệp vụ auth
- `AuthServiceImpl.java`: xử lý thật
- `LoginRequest.java`: request đăng nhập
- `RegisterRequest.java`: request đăng ký
- `AuthResponse.java`: token + profile cơ bản
- `ChangePasswordRequest.java`: đổi mật khẩu

### Endpoint gợi ý
```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/change-password
GET    /api/auth/me
```

---

## 4.2. Module `user`

### Chức năng
- xem hồ sơ cá nhân
- cập nhật thông tin tài khoản
- cập nhật thể loại yêu thích
- admin xem danh sách user

### File chính
- `User.java`: entity người dùng
- `UserRepository.java`
- `UserController.java`
- `UserService.java`, `UserServiceImpl.java`
- `UpdateProfileRequest.java`
- `UpdateFavoriteGenresRequest.java`
- `UserProfileResponse.java`

### Endpoint gợi ý
```text
GET    /api/users/me
PUT    /api/users/me
PUT    /api/users/me/favorite-genres
GET    /api/admin/users
GET    /api/admin/users/{id}
PATCH  /api/admin/users/{id}/lock
PATCH  /api/admin/users/{id}/unlock
DELETE /api/admin/users/{id}
```

---

## 4.3. Module `genre`

### Chức năng
- lấy danh sách thể loại
- CRUD thể loại cho admin
- liên kết thể loại yêu thích của user

### File chính
- `Genre.java`
- `UserGenre.java`
- `GenreRepository.java`
- `UserGenreRepository.java`
- `GenreController.java`
- `AdminGenreController.java`
- `GenreService.java`, `GenreServiceImpl.java`

### Endpoint gợi ý
```text
GET    /api/genres
GET    /api/genres/{id}
POST   /api/admin/genres
PUT    /api/admin/genres/{id}
DELETE /api/admin/genres/{id}
```

---

## 4.4. Module `movie`

### Chức năng
- danh sách phim
- chi tiết phim
- phim theo thể loại
- phim lẻ
- đang chiếu
- đã hoàn thành
- top phim
- đánh giá cao
- CRUD phim cho admin
- gán thể loại cho phim

### File chính
- `Movie.java`
- `MovieGenre.java`
- `MovieActor.java`
- `MovieDirector.java`
- `MovieRepository.java`
- `MovieGenreRepository.java`
- `MovieController.java`
- `PublicMovieController.java`
- `AdminMovieController.java`
- `MovieService.java`
- `MovieQueryService.java`
- `MovieAdminService.java`
- `MovieMapper.java`
- `MovieSpecification.java`

### DTO gợi ý
- `MovieListResponse.java`: cho trang list
- `MovieDetailResponse.java`: cho trang chi tiết
- `CreateMovieRequest.java`
- `UpdateMovieRequest.java`
- `AssignGenresRequest.java`
- `MovieSearchRequest.java`

### Endpoint gợi ý
```text
GET    /api/movies
GET    /api/movies/{id}
GET    /api/movies/slug/{slug}
GET    /api/movies/genre/{genreId}
GET    /api/movies/top
GET    /api/movies/high-rated
GET    /api/movies/now-showing
GET    /api/movies/completed
GET    /api/movies/single
POST   /api/admin/movies
PUT    /api/admin/movies/{id}
DELETE /api/admin/movies/{id}
PUT    /api/admin/movies/{id}/genres
```

---

## 4.5. Module `episode`

### Chức năng
- lấy danh sách tập phim
- admin thêm/sửa/xóa tập phim
- hỗ trợ phim bộ và tiếp tục xem theo tập

### File chính
- `Episode.java`
- `EpisodeRepository.java`
- `EpisodeController.java`
- `AdminEpisodeController.java`
- `EpisodeService.java`
- `EpisodeServiceImpl.java`

### Endpoint gợi ý
```text
GET    /api/movies/{movieId}/episodes
GET    /api/episodes/{id}
POST   /api/admin/movies/{movieId}/episodes
PUT    /api/admin/episodes/{id}
DELETE /api/admin/episodes/{id}
```

---

## 4.6. Module `schedule`

### Chức năng
- xem lịch chiếu
- admin quản lý lịch chiếu

### File chính
- `Schedule.java`
- `ScheduleRepository.java`
- `ScheduleController.java`
- `AdminScheduleController.java`
- `ScheduleService.java`
- `ScheduleServiceImpl.java`

### Endpoint gợi ý
```text
GET    /api/schedules
GET    /api/movies/{movieId}/schedules
POST   /api/admin/schedules
PUT    /api/admin/schedules/{id}
DELETE /api/admin/schedules/{id}
```

---

## 4.7. Module `comment`

### Chức năng
- thêm bình luận
- sửa/xóa bình luận của chính mình
- admin kiểm duyệt/xóa bình luận

### File chính
- `Comment.java`
- `CommentRepository.java`
- `CommentController.java`
- `CommentService.java`
- `CommentServiceImpl.java`

### Endpoint gợi ý
```text
GET    /api/movies/{movieId}/comments
POST   /api/movies/{movieId}/comments
PUT    /api/comments/{id}
DELETE /api/comments/{id}
DELETE /api/admin/comments/{id}
```

---

## 4.8. Module `rating`

### Chức năng
- người dùng đánh giá phim
- cập nhật rating nếu đã đánh giá trước
- tính trung bình rating và count

### File chính
- `Rating.java`
- `RatingRepository.java`
- `RatingController.java`
- `RatingService.java`
- `RatingServiceImpl.java`
- `RateMovieRequest.java`
- `RatingSummaryResponse.java`

### Endpoint gợi ý
```text
POST   /api/movies/{movieId}/ratings
GET    /api/movies/{movieId}/ratings/summary
GET    /api/users/me/ratings
```

---

## 4.9. Module `like`

### Chức năng
- thích / bỏ thích phim
- lấy danh sách phim đã thích

### File chính
- `MovieLike.java`
- `MovieLikeRepository.java`
- `LikeController.java`
- `LikeService.java`
- `LikeServiceImpl.java`

### Endpoint gợi ý
```text
POST   /api/movies/{movieId}/like/toggle
GET    /api/users/me/likes
```

---

## 4.10. Module `watchlist`

### Chức năng
- lưu phim vào theo dõi
- bỏ lưu
- danh sách phim theo dõi

### File chính
- `WatchlistItem.java`
- `WatchlistRepository.java`
- `WatchlistController.java`
- `WatchlistService.java`
- `WatchlistServiceImpl.java`

### Endpoint gợi ý
```text
POST   /api/movies/{movieId}/watchlist/toggle
GET    /api/users/me/watchlist
```

---

## 4.11. Module `watchhistory`

### Chức năng
- lưu lịch sử xem
- lưu tiến độ xem
- lấy lịch sử xem
- lấy danh sách tiếp tục xem

### File chính
- `WatchLog.java`
- `WatchLogRepository.java`
- `WatchHistoryController.java`
- `WatchHistoryService.java`
- `WatchHistoryServiceImpl.java`
- `SaveWatchProgressRequest.java`
- `WatchHistoryResponse.java`
- `ContinueWatchingResponse.java`

### Endpoint gợi ý
```text
POST   /api/watch-history/progress
GET    /api/users/me/watch-history
GET    /api/users/me/continue-watching
DELETE /api/users/me/watch-history/{id}
```

---

## 4.12. Module `search`

### Chức năng
- tìm kiếm phim
- lưu lịch sử tìm kiếm nếu đã đăng nhập
- gợi ý từ khóa

### File chính
- `SearchHistory.java`
- `SearchHistoryRepository.java`
- `SearchController.java`
- `SearchService.java`
- `SearchServiceImpl.java`

### Endpoint gợi ý
```text
GET    /api/search/movies?q=
GET    /api/search/suggestions?q=
GET    /api/users/me/search-history
```

---

## 4.13. Module `recommendation`

### Chức năng
- gợi ý phim cho user theo thể loại yêu thích
- kết hợp lịch sử xem, like, rating
- fallback theo top/popular nếu user chưa đủ dữ liệu

### File chính
- `RecommendationController.java`
- `RecommendationService.java`
- `RecommendationServiceImpl.java`
- `RecommendationScoringService.java`
- `RecommendationScoringServiceImpl.java`
- `RecommendationFallbackService.java`
- `RecommendationFallbackServiceImpl.java`
- `GenreBasedRecommendationStrategy.java`
- `HistoryBasedRecommendationStrategy.java`
- `PopularMovieFallbackStrategy.java`
- `HybridRecommendationStrategy.java`

### Ý tưởng thuật toán ban đầu
Chưa cần ML phức tạp. Có thể bắt đầu bằng **hybrid score**:

```text
recommendation_score =
    0.40 * genre_match_score
  + 0.25 * watch_history_score
  + 0.20 * like_score
  + 0.10 * rating_score
  + 0.05 * trending_score
```

### Endpoint gợi ý
```text
GET    /api/recommendations/me
GET    /api/recommendations/home
```

---

## 4.14. Module `dashboard`

### Chức năng
- thống kê admin
- top phim được xem nhiều
- phim được đánh giá cao
- thể loại phổ biến
- số user, số movie, số comment

### File chính
- `AdminDashboardController.java`
- `DashboardService.java`
- `DashboardServiceImpl.java`
- `DashboardOverviewResponse.java`
- `TrendingMovieResponse.java`
- `GenreStatisticResponse.java`

### Endpoint gợi ý
```text
GET    /api/admin/dashboard/overview
GET    /api/admin/dashboard/trending-movies
GET    /api/admin/dashboard/top-genres
```

---

## 4.15. Module `actor` và `director`

### Chức năng
- CRUD diễn viên
- CRUD đạo diễn
- liên kết với phim

### File chính
- `Actor.java`, `ActorRepository.java`, `ActorService.java`, `AdminActorController.java`
- `Director.java`, `DirectorRepository.java`, `DirectorService.java`, `AdminDirectorController.java`

### Endpoint gợi ý
```text
GET    /api/admin/actors
POST   /api/admin/actors
PUT    /api/admin/actors/{id}
DELETE /api/admin/actors/{id}

GET    /api/admin/directors
POST   /api/admin/directors
PUT    /api/admin/directors/{id}
DELETE /api/admin/directors/{id}
```

---

## 4.16. Module `media`

### Chức năng
- upload poster
- upload thumbnail
- upload subtitle
- upload video/tập phim (nếu cần)

### File chính
- `UploadController.java`
- `FileStorageService.java`
- `LocalFileStorageService.java`
- `S3FileStorageService.java`
- `UploadResponse.java`

### Endpoint gợi ý
```text
POST   /api/admin/uploads/image
POST   /api/admin/uploads/video
POST   /api/admin/uploads/subtitle
```

---

# 5. Entity mapping theo ERD của bạn

Dựa trên ERD đã có, mapping sang JPA có thể như sau:

| Bảng | Entity Java | Ghi chú |
|---|---|---|
| USERS | `User` | thông tin tài khoản |
| ROLE | `Role` | vai trò user/admin |
| GENRE | `Genre` | thể loại phim |
| USERS_GENRE | `UserGenre` | thể loại yêu thích của user |
| MOVIES | `Movie` | dữ liệu phim |
| MOVIES_GENRE | `MovieGenre` | liên kết phim-thể loại |
| EPISODES | `Episode` | tập phim |
| WATCH_LOGS | `WatchLog` | lịch sử xem, tiến độ xem |
| COMMENTS | `Comment` | bình luận |
| RATINGS | `Rating` | đánh giá |
| LIKES | `MovieLike` | thích phim |
| SEARCH_HISTORY | `SearchHistory` | lịch sử tìm kiếm |
| SCHEDULES | `Schedule` | lịch chiếu |
| ACTORS | `Actor` | diễn viên |
| DIRECTORS | `Director` | đạo diễn |
| MOVIES_ACTORS | `MovieActor` | liên kết phim-diễn viên |
| MOVIES_DIRECTORS | `MovieDirector` | liên kết phim-đạo diễn |

**Nên bổ sung thêm bảng** nếu bạn muốn đủ chức năng “theo dõi / saved movie”:
- `watchlist_items`

---

# 6. Cấu trúc frontend Next.js chi tiết

## 6.1. Nguyên tắc tổ chức frontend

Frontend nên tổ chức theo:
- **App Router** để quản lý route rõ ràng
- **feature folder** để bám theo nghiệp vụ
- tách riêng `components`, `services`, `hooks`, `types`, `lib`

---

## 6.2. Cây thư mục frontend đề xuất

```text
frontend/
├─ package.json
├─ next.config.ts
├─ tsconfig.json
├─ .env.example
├─ public/
│  ├─ images/
│  ├─ icons/
│  └─ placeholders/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ globals.css
│  │  ├─ page.tsx                          # trang chủ
│  │  │
│  │  ├─ (auth)/
│  │  │  ├─ login/page.tsx
│  │  │  └─ register/page.tsx
│  │  │
│  │  ├─ movies/
│  │  │  ├─ page.tsx                       # danh sách phim
│  │  │  ├─ [slug]/page.tsx                # chi tiết phim
│  │  │  └─ [slug]/watch/page.tsx          # xem phim
│  │  │
│  │  ├─ genres/
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]/page.tsx
│  │  │
│  │  ├─ top/page.tsx
│  │  ├─ high-rated/page.tsx
│  │  ├─ now-showing/page.tsx
│  │  ├─ completed/page.tsx
│  │  ├─ schedules/page.tsx
│  │  ├─ recommendations/page.tsx
│  │  │
│  │  ├─ account/
│  │  │  ├─ page.tsx
│  │  │  ├─ history/page.tsx
│  │  │  ├─ watchlist/page.tsx
│  │  │  ├─ liked/page.tsx
│  │  │  └─ preferences/page.tsx
│  │  │
│  │  ├─ admin/
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ movies/page.tsx
│  │  │  ├─ genres/page.tsx
│  │  │  ├─ users/page.tsx
│  │  │  ├─ schedules/page.tsx
│  │  │  ├─ actors/page.tsx
│  │  │  ├─ directors/page.tsx
│  │  │  ├─ episodes/page.tsx
│  │  │  └─ statistics/page.tsx
│  │  │
│  │  ├─ not-found.tsx
│  │  └─ loading.tsx
│  │
│  ├─ components/
│  │  ├─ ui/
│  │  │  ├─ button.tsx
│  │  │  ├─ input.tsx
│  │  │  ├─ dialog.tsx
│  │  │  ├─ select.tsx
│  │  │  ├─ textarea.tsx
│  │  │  ├─ badge.tsx
│  │  │  ├─ pagination.tsx
│  │  │  ├─ skeleton.tsx
│  │  │  ├─ tabs.tsx
│  │  │  └─ toast.tsx
│  │  ├─ layout/
│  │  │  ├─ header.tsx
│  │  │  ├─ footer.tsx
│  │  │  ├─ sidebar.tsx
│  │  │  └─ admin-sidebar.tsx
│  │  ├─ movie/
│  │  │  ├─ movie-card.tsx
│  │  │  ├─ movie-grid.tsx
│  │  │  ├─ movie-detail.tsx
│  │  │  ├─ video-player.tsx
│  │  │  ├─ continue-watching-card.tsx
│  │  │  ├─ rating-stars.tsx
│  │  │  ├─ like-button.tsx
│  │  │  ├─ watchlist-button.tsx
│  │  │  └─ comment-list.tsx
│  │  ├─ genre/
│  │  │  ├─ genre-list.tsx
│  │  │  └─ favorite-genre-selector.tsx
│  │  ├─ search/
│  │  │  ├─ search-bar.tsx
│  │  │  ├─ search-result-list.tsx
│  │  │  └─ search-suggestion.tsx
│  │  └─ admin/
│  │     ├─ movie-form.tsx
│  │     ├─ genre-form.tsx
│  │     ├─ user-table.tsx
│  │     ├─ schedule-form.tsx
│  │     └─ statistics-chart.tsx
│  │
│  ├─ features/
│  │  ├─ auth/
│  │  │  ├─ api.ts
│  │  │  ├─ hooks.ts
│  │  │  ├─ types.ts
│  │  │  └─ store.ts
│  │  ├─ movie/
│  │  │  ├─ api.ts
│  │  │  ├─ hooks.ts
│  │  │  ├─ types.ts
│  │  │  ├─ utils.ts
│  │  │  └─ store.ts
│  │  ├─ recommendation/
│  │  │  ├─ api.ts
│  │  │  ├─ hooks.ts
│  │  │  └─ types.ts
│  │  ├─ comment/
│  │  │  ├─ api.ts
│  │  │  ├─ hooks.ts
│  │  │  └─ types.ts
│  │  ├─ rating/
│  │  │  ├─ api.ts
│  │  │  ├─ hooks.ts
│  │  │  └─ types.ts
│  │  ├─ watch-history/
│  │  │  ├─ api.ts
│  │  │  ├─ hooks.ts
│  │  │  └─ types.ts
│  │  ├─ watchlist/
│  │  │  ├─ api.ts
│  │  │  ├─ hooks.ts
│  │  │  └─ types.ts
│  │  └─ admin/
│  │     ├─ api.ts
│  │     ├─ hooks.ts
│  │     └─ types.ts
│  │
│  ├─ lib/
│  │  ├─ axios.ts
│  │  ├─ fetcher.ts
│  │  ├─ auth.ts
│  │  ├─ cookies.ts
│  │  ├─ cn.ts
│  │  ├─ env.ts
│  │  ├─ constants.ts
│  │  └─ routes.ts
│  │
│  ├─ hooks/
│  │  ├─ use-auth.ts
│  │  ├─ use-debounce.ts
│  │  ├─ use-pagination.ts
│  │  ├─ use-video-progress.ts
│  │  └─ use-role-guard.ts
│  │
│  ├─ providers/
│  │  ├─ query-provider.tsx
│  │  ├─ theme-provider.tsx
│  │  └─ auth-provider.tsx
│  │
│  ├─ types/
│  │  ├─ api.ts
│  │  ├─ auth.ts
│  │  ├─ movie.ts
│  │  ├─ genre.ts
│  │  ├─ comment.ts
│  │  ├─ rating.ts
│  │  └─ user.ts
│  │
│  └─ middleware.ts
└─ README.md
```

---

# 7. Giải thích vai trò của từng phần frontend

## 7.1. `app/`

Đây là nơi định nghĩa route theo App Router.

### Route công khai
- `/`
- `/movies`
- `/movies/[slug]`
- `/genres`
- `/top`
- `/high-rated`
- `/now-showing`
- `/completed`
- `/schedules`

### Route cần đăng nhập
- `/account`
- `/account/history`
- `/account/watchlist`
- `/account/preferences`
- `/recommendations`

### Route admin
- `/admin/movies`
- `/admin/genres`
- `/admin/users`
- `/admin/schedules`
- `/admin/statistics`

---

## 7.2. `components/`

Component UI và component nghiệp vụ dùng lại.

### `components/ui/`
Các component nền tảng như button, dialog, tabs, input, toast.

### `components/movie/`
Các component chuyên biệt cho domain phim:
- `movie-card.tsx`
- `video-player.tsx`
- `rating-stars.tsx`
- `like-button.tsx`
- `watchlist-button.tsx`

### `components/admin/`
Form và bảng cho admin.

---

## 7.3. `features/`

Đây là phần cực quan trọng cho vibe coding vì gom:
- API call
- hooks
- state
- types

Ví dụ `features/movie/` sẽ có:
- `api.ts`: gọi `/api/movies`
- `hooks.ts`: `useMovieList`, `useMovieDetail`
- `types.ts`: type list/detail
- `store.ts`: state cục bộ nếu cần

---

# 8. Cấu trúc database chi tiết

```text
database/
├─ migrations/
│  ├─ V1__init_schema.sql
│  ├─ V2__seed_roles.sql
│  ├─ V3__seed_genres.sql
│  ├─ V4__seed_admin.sql
│  ├─ V5__seed_movies.sql
│  ├─ V6__seed_episodes.sql
│  └─ V7__create_indexes.sql
├─ seeds/
│  ├─ dev_seed.sql
│  ├─ demo_seed.sql
│  └─ test_seed.sql
├─ backups/
├─ diagrams/
│  └─ erd.png
└─ README.md
```

## 8.1. Migration nên có

### `V1__init_schema.sql`
Tạo bảng:
- roles
- users
- genres
- users_genre
- movies
- movies_genre
- comments
- ratings
- likes
- watch_logs
- search_history
- episodes
- schedules
- actors
- directors
- movies_actors
- movies_directors
- watchlist_items

### `V2__seed_roles.sql`
- ROLE_ADMIN
- ROLE_USER

### `V3__seed_genres.sql`
Seed thể loại mặc định:
- Hành động
- Tình cảm
- Kinh dị
- Hài
- Hoạt hình
- Khoa học viễn tưởng
- Phiêu lưu
- Tâm lý

### `V4__seed_admin.sql`
Tạo tài khoản admin mặc định.

---

# 9. Mapping chức năng -> backend -> frontend -> DB

## 9.1. Đăng ký / Đăng nhập
- Backend: `auth/`, `user/`, `security/`
- Frontend: `/login`, `/register`, `features/auth/`
- DB: `users`, `roles`

## 9.2. Tìm kiếm phim
- Backend: `search/`, `movie/`
- Frontend: `components/search/`, `features/movie/`
- DB: `movies`, `search_history`

## 9.3. Xem phim
- Backend: `movie/`, `episode/`, `watchhistory/`
- Frontend: `video-player.tsx`, `/movies/[slug]/watch`
- DB: `movies`, `episodes`, `watch_logs`

## 9.4. Thích phim
- Backend: `like/`
- Frontend: `like-button.tsx`, `features/movie/`
- DB: `likes`

## 9.5. Lưu phim theo dõi
- Backend: `watchlist/`
- Frontend: `watchlist-button.tsx`, `/account/watchlist`
- DB: `watchlist_items`

## 9.6. Bình luận
- Backend: `comment/`
- Frontend: `comment-list.tsx`, `features/comment/`
- DB: `comments`

## 9.7. Đánh giá
- Backend: `rating/`
- Frontend: `rating-stars.tsx`, `features/rating/`
- DB: `ratings`

## 9.8. Cập nhật thể loại yêu thích
- Backend: `genre/`, `user/`
- Frontend: `favorite-genre-selector.tsx`, `/account/preferences`
- DB: `users_genre`

## 9.9. Gợi ý phim
- Backend: `recommendation/`
- Frontend: `/recommendations`, `features/recommendation/`
- DB: `users_genre`, `watch_logs`, `likes`, `ratings`, `movies_genre`

## 9.10. Quản trị phim
- Backend: `movie/`, `genre/`, `actor/`, `director/`, `episode/`, `schedule/`
- Frontend: `/admin/*`
- DB: toàn bộ bảng domain phim

---

# 10. Phần hỗ trợ vibe coding

Đây là phần rất nên có để bạn code nhanh bằng AI assistant, Cursor, Copilot, Claude Code, ChatGPT.

## 10.1. Cấu trúc thư mục hỗ trợ AI

```text
.ai/
├─ context/
│  ├─ domain-overview.md
│  ├─ erd-summary.md
│  ├─ api-contracts.md
│  ├─ coding-conventions.md
│  ├─ backend-rules.md
│  └─ frontend-rules.md
├─ prompts/
│  ├─ create-spring-feature.prompt.md
│  ├─ create-next-page.prompt.md
│  ├─ create-crud-admin.prompt.md
│  ├─ create-jpa-entity.prompt.md
│  └─ create-react-query-hook.prompt.md
├─ tasks/
│  ├─ phase-1-auth.md
│  ├─ phase-2-movie.md
│  ├─ phase-3-interaction.md
│  ├─ phase-4-recommendation.md
│  └─ phase-5-admin.md
└─ checklists/
   ├─ backend-feature-checklist.md
   ├─ frontend-page-checklist.md
   └─ release-checklist.md
```

---

## 10.2. File `AGENTS.md`

Nên có file này ở root để mô tả ngắn cho AI:

```md
# AGENTS.md

## Project
Movie Recommendation System using Spring Boot, Next.js, MySQL.

## Rules
- Backend must follow feature-first architecture.
- Use DTO for all request/response objects.
- Never expose JPA entity directly to controller.
- Use MapStruct or manual mapper.
- Frontend must use App Router and React Query.
- All admin routes require role ADMIN.
- Recommendation logic starts with rule-based scoring, not ML.
- Keep naming in English for code, Vietnamese for docs if needed.
```

---

## 10.3. File `.cursorrules`

```text
- Use Java 21 and Spring Boot 3.
- Prefer constructor injection.
- Keep controllers thin, services handle business logic.
- Use ResponseEntity only when needed.
- Return unified API response shape.
- Never mix admin and public endpoints in same controller if avoidable.
- For Next.js, use server components by default and client components only when needed.
- Create React Query hooks for all remote data fetching.
- Use zod or simple validation on frontend forms.
- Use Flyway for every schema change.
```

---

## 10.4. Prompt mẫu để tạo 1 feature backend

```md
Create a full Spring Boot feature module named `rating` for a movie recommendation system.
Requirements:
- package path: com.example.movierecommendation.rating
- include controller, service, service impl, entity, repository, dto, mapper
- endpoints:
  - POST /api/movies/{movieId}/ratings
  - GET /api/movies/{movieId}/ratings/summary
- user can create or update rating
- update movie average rating and rating count after rating changes
- use JPA and MySQL
- do not expose entity directly
- include validation and exception handling
```

---

## 10.5. Prompt mẫu để tạo 1 page frontend

```md
Create a Next.js App Router page for `/account/watchlist`.
Requirements:
- use TypeScript
- use React Query
- fetch data from GET /api/users/me/watchlist
- render movie cards in a responsive grid
- support empty state
- support loading skeleton
- support removing movie from watchlist
- use components from src/components/movie/movie-card.tsx when possible
```

---

# 11. Thứ tự triển khai khuyến nghị

## Giai đoạn 1: Nền tảng
- backend spring init
- security
- user, role
- auth login/register
- flyway migration
- frontend next init
- layout, login/register page

## Giai đoạn 2: Nội dung phim
- genre
- movie
- episode
- schedule
- movie detail page
- watch page

## Giai đoạn 3: Tương tác
- comment
- rating
- like
- watchlist
- watch history

## Giai đoạn 4: Gợi ý
- user favorite genres
- recommendation service
- recommendation page
- continue watching

## Giai đoạn 5: Admin
- admin dashboard
- movie CRUD
- genre CRUD
- actor/director CRUD
- user management
- statistics

---

# 12. Checklist tạo một feature backend chuẩn

Mỗi khi tạo 1 module backend, hãy tạo đủ:

- `controller/`
- `service/`
- `service impl`
- `entity/`
- `repository/`
- `dto/`
- `mapper/`
- validation
- exception case
- test cơ bản
- endpoint docs

Ví dụ với module `comment`:
- `CommentController.java`
- `CommentService.java`
- `CommentServiceImpl.java`
- `Comment.java`
- `CommentRepository.java`
- `CreateCommentRequest.java`
- `CommentResponse.java`
- `CommentMapper.java`

---

# 13. Checklist tạo một page frontend chuẩn

Mỗi page nên có:
- route file trong `app/`
- hook fetch dữ liệu
- type dữ liệu
- loading state
- empty state
- error state
- component con nếu page dài
- action handler nếu có like/save/comment/rating

---

# 14. Tên file quan trọng nên code trước

## Backend code trước
1. `SecurityConfig.java`
2. `JwtTokenProvider.java`
3. `User.java`
4. `Role.java`
5. `AuthController.java`
6. `AuthServiceImpl.java`
7. `Movie.java`
8. `Genre.java`
9. `MovieController.java`
10. `MovieServiceImpl.java`
11. `RecommendationServiceImpl.java`
12. `WatchHistoryServiceImpl.java`

## Frontend code trước
1. `src/lib/axios.ts`
2. `src/providers/query-provider.tsx`
3. `src/app/layout.tsx`
4. `src/app/(auth)/login/page.tsx`
5. `src/app/page.tsx`
6. `src/components/movie/movie-card.tsx`
7. `src/app/movies/[slug]/page.tsx`
8. `src/app/movies/[slug]/watch/page.tsx`
9. `src/app/recommendations/page.tsx`
10. `src/app/admin/movies/page.tsx`

---

# 15. Kết luận

Với stack **Spring Boot + Next.js + MySQL**, cấu trúc ở trên đủ để bạn triển khai:
- đầy đủ chức năng người dùng
- đầy đủ chức năng admin
- logic gợi ý phim theo thể loại và hành vi xem
- dễ mở rộng sau này
- rất phù hợp để vibe coding vì đã chia rõ domain, file, trách nhiệm và prompt hỗ trợ AI

Nếu làm tiếp bước sau, nên tạo thêm 3 tài liệu nữa:
1. **OpenAPI endpoint list hoàn chỉnh**
2. **Database schema SQL hoàn chỉnh theo MySQL**
3. **Skeleton source code generation plan**
