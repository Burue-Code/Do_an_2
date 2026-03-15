-- V8: Chuẩn hóa movie_type: 1 = phim lẻ, 2 = phim bộ
-- Trước đây seed dùng 0 = phim lẻ, 1 = phim bộ

-- Bước 1: Đổi tạm 1 -> 99 để tránh conflict
UPDATE movies SET movie_type = 99 WHERE movie_type = 1;

-- Bước 2: 0 (phim lẻ) -> 1
UPDATE movies SET movie_type = 1 WHERE movie_type = 0;

-- Bước 3: 99 (phim bộ cũ) -> 2
UPDATE movies SET movie_type = 2 WHERE movie_type = 99;
