# Tài liệu frontend – Next.js App Router

Tài liệu này mô tả tổng quan **frontend** của hệ thống, dựa trên:

- Tech stack (`docs/resources/tech_stack.md`)
- API (`docs/api/openapi.yaml`)
- SRS & Use Case (`docs/resources/srs.md`, `docs/resources/use_case.plantuml`)

---

## 1. Công nghệ chính

- **Framework**: Next.js 14/15 – App Router.
- **Ngôn ngữ**: TypeScript.
- **UI**: React component, chia nhỏ theo `components/ui`, `components/movie`, `components/admin`...
- **Data fetching**: React Query (TanStack Query), HTTP client `axios`.
- **Routing**: App Router trong `src/app/`.

---

## 2. Cấu trúc thư mục frontend (tóm tắt)

Tham khảo chi tiết trong `tech_stack.md`, phần frontend:

- `src/app/`
  - Trang công khai: `/`, `/movies`, `/movies/[slug]`, `/movies/[slug]/watch`, `/genres`, `/top`, `/high-rated`, `/now-showing`, `/completed`, `/schedules`.
  - Trang yêu cầu đăng nhập: `/account`, `/account/history`, `/account/watchlist`, `/account/liked`, `/account/preferences`, `/recommendations`.
  - Trang admin: `/admin/*` (movies, genres, users, schedules, actors, directors, episodes, statistics).
- `src/components/`
  - `ui/`: button, input, dialog, select, textarea, badge, pagination, skeleton, tabs, toast...
  - `layout/`: header, footer, sidebar, admin-sidebar...
  - `movie/`: movie-card, movie-grid, movie-detail, video-player, continue-watching-card, rating-stars, like-button, watchlist-button, comment-list...
  - `admin/`: movie-form, genre-form, user-table, schedule-form, statistics-chart...
- `src/features/`
  - `auth`, `movie`, `recommendation`, `comment`, `rating`, `watch-history`, `watchlist`, `admin`...
- `src/lib/`
  - `axios.ts`, `fetcher.ts`, `auth.ts`, `cookies.ts`, `constants.ts`, `routes.ts`...
- `src/hooks/`
  - `use-auth`, `use-debounce`, `use-pagination`, `use-video-progress`, `use-role-guard`...

---

## 3. Nguyên tắc thiết kế giao diện

- Giao diện **hiện đại, dễ dùng, nhất quán**:
  - Navigation rõ ràng giữa trang chủ, danh sách phim, chi tiết, xem phim, tài khoản, admin.
  - Responsive tốt trên desktop/laptop (ưu tiên cho đồ án).
- Sử dụng:
  - **Server Component** cho các trang chủ yếu hiển thị dữ liệu.
  - **Client Component** cho thành phần tương tác (form, nút like, rating, comment, player).
- Mỗi page cần:
  - Loading state.
  - Empty state.
  - Error state (thông báo thân thiện).

---

## 4. Mapping Use Case → Page → API

Ví dụ một số luồng chính:

### 4.1. Đăng nhập (UC2)

- **Page**:
  - `/login`
- **Feature**:
  - `features/auth/api.ts` – gọi `POST /api/auth/login`.
  - `features/auth/hooks.ts` – `useLogin`.
- **UI**:
  - Form đăng nhập (username/password), validate cơ bản.
- **API**:
  - `POST /api/auth/login` (xem `openapi.yaml`).

### 4.2. Xem phim (UC5)

- **Page**:
  - `/movies/[slug]` – chi tiết phim.
  - `/movies/[slug]/watch` – xem phim (player + chọn tập).
- **Feature**:
  - `features/movie/api.ts` – chi tiết phim, danh sách tập.
  - `features/watch-history/api.ts` – lưu tiến độ, lịch sử xem.
- **UI**:
  - `movie-detail.tsx`, `video-player.tsx`, `continue-watching-card.tsx`.

### 4.3. Lưu phim theo dõi (UC7)

- **Page**:
  - `/account/watchlist`
- **UI**:
  - `watchlist-button.tsx`, `movie-card.tsx`.
- **API**:
  - `POST /api/movies/{movieId}/watchlist/toggle`
  - `GET /api/users/me/watchlist`

### 4.4. Gợi ý phim phù hợp (UC13)

- **Page**:
  - `/recommendations`
- **Feature**:
  - `features/recommendation/api.ts`, `hooks.ts`.
- **API**:
  - `GET /api/recommendations/me`

---

## 5. Liên hệ với tài liệu khác

- **SRS & Use Case**:
  - Mỗi Use Case người dùng → ít nhất 1 page/frontend flow tương ứng.
- **API**:
  - Các hook React Query sử dụng endpoint từ `openapi.yaml`.
- **Tech Stack**:
  - Quy ước coding, kiểu component, thư viện UI, cách chia `features/*`.

Khi thêm chức năng mới, hãy:

1. Thêm Use Case (nếu cần) trong `srs.md` / `use_case.plantuml`.
2. Cập nhật API trong `docs/api/openapi.yaml`.
3. Tạo `feature` + `page` tương ứng trong frontend và cập nhật tài liệu này nếu luồng mới đủ quan trọng.

