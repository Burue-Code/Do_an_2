-- V3__seed_genres.sql
-- Seed dữ liệu thể loại phim mặc định

INSERT INTO genres (genre_name)
VALUES ('Hành động'),
       ('Tình cảm'),
       ('Kinh dị'),
       ('Hài'),
       ('Hoạt hình'),
       ('Khoa học viễn tưởng'),
       ('Phiêu lưu'),
       ('Tâm lý')
ON DUPLICATE KEY UPDATE genre_name = genre_name;
