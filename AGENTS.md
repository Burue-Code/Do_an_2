# AGENTS.md – Hệ thống gợi ý phim

Dự án đồ án hệ thống gợi ý phim theo thể loại.

## Stack
- **Backend**: Java 21, Spring Boot 3.x, JPA/Hibernate, Flyway, JWT, springdoc-openapi
- **Frontend**: Next.js 14/15 App Router, TypeScript, React Query, axios
- **Database**: MySQL 8.x

## Cấu trúc
- `backend/` – Spring Boot API
- `frontend/` – Next.js SPA
- `database/` – migration, seed, backup
- `docs/` – SRS, ERD, tech_stack

## Quy ước
- Backend: feature-first (auth, user, movie, genre...), DTO, BaseResponse/PageResponse
- Frontend: Server Component mặc định, React Query cho API, src/features/* theo domain
- API: luôn bọc response qua BaseResponse

## Tài liệu tham khảo
- `docs/resources/tech_stack.md`
- `docs/resources/project_structure.md`
