-- V4__seed_movies.sql
-- Seed dữ liệu phim mẫu (phụ thuộc V3 genres)

INSERT INTO movies (title, description, release_year, poster, duration, status, total_episodes, rating_score, rating_count, movie_type, created_at)
VALUES
    ('Avatar: Dòng chảy của nước', 'Câu chuyện về gia đình Sully và những thách thức mới dưới đại dương Pandora.', 2022, NULL, 192, 'Đang chiếu', NULL, 8.2, 12500, 0, NOW()),
    ('Avengers: Endgame', 'Các siêu anh hùng tập hợp lần cuối để đảo ngược Thanos.', 2019, NULL, 181, 'Hoàn thành', NULL, 8.4, 98500, 0, NOW()),
    ('Squid Game', '456 người tham gia trò chơi sinh tử để giành giải thưởng khổng lồ.', 2021, NULL, NULL, 'Hoàn thành', 9, 8.0, 45200, 1, NOW()),
    ('Parasite', 'Gia đình nghèo thâm nhập vào cuộc sống của gia đình giàu có.', 2019, NULL, 132, 'Hoàn thành', NULL, 8.6, 67800, 0, NOW()),
    ('Spirited Away', 'Cô bé Chihiro phiêu lưu vào thế giới thần linh để cứu cha mẹ.', 2001, NULL, 125, 'Hoàn thành', NULL, 8.6, 89200, 0, NOW()),
    ('The Dark Knight', 'Batman đối đầu với Joker - tên tội phạm hỗn loạn nhất Gotham.', 2008, NULL, 152, 'Hoàn thành', NULL, 9.0, 156000, 0, NOW()),
    ('Inception', 'Dom Cobb chuyên đánh cắp bí mật qua giấc mơ, nhận nhiệm vụ cấy ý tưởng.', 2010, NULL, 148, 'Hoàn thành', NULL, 8.8, 112000, 0, NOW()),
    ('Your Name', 'Hai thiếu niên bất ngờ hoán đổi cơ thể và bị cuốn vào số phận định sẵn.', 2016, NULL, 106, 'Hoàn thành', NULL, 8.2, 76500, 0, NOW()),
    ('Breaking Bad', 'Giáo viên hóa học bước vào con đường sản xuất ma túy.', 2008, NULL, NULL, 'Hoàn thành', 62, 9.5, 89200, 1, NOW()),
    ('The Shawshank Redemption', 'Andy Dufresne bị kết án oan và tìm cách vượt ngục.', 1994, NULL, 142, 'Hoàn thành', NULL, 9.3, 178000, 0, NOW());

-- Liên kết phim với thể loại (dùng subquery lấy genre_id từ genre_name)
INSERT IGNORE INTO movies_genre (movie_id, genre_id)
SELECT m.movie_id, g.genre_id
FROM movies m,
     genres g
WHERE g.genre_name = 'Khoa học viễn tưởng' AND m.title = 'Avatar: Dòng chảy của nước'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Phiêu lưu' AND m.title = 'Avatar: Dòng chảy của nước'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Hành động' AND m.title = 'Avatar: Dòng chảy của nước'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Hành động' AND m.title = 'Avengers: Endgame'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Khoa học viễn tưởng' AND m.title = 'Avengers: Endgame'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Phiêu lưu' AND m.title = 'Avengers: Endgame'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Kinh dị' AND m.title = 'Squid Game'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Tâm lý' AND m.title = 'Squid Game'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Tâm lý' AND m.title = 'Parasite'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Hài' AND m.title = 'Parasite'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Hoạt hình' AND m.title = 'Spirited Away'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Phiêu lưu' AND m.title = 'Spirited Away'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Tình cảm' AND m.title = 'Spirited Away'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Hành động' AND m.title = 'The Dark Knight'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Tâm lý' AND m.title = 'The Dark Knight'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Khoa học viễn tưởng' AND m.title = 'Inception'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Hành động' AND m.title = 'Inception'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Hoạt hình' AND m.title = 'Your Name'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Tình cảm' AND m.title = 'Your Name'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Tâm lý' AND m.title = 'Breaking Bad'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Hành động' AND m.title = 'Breaking Bad'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Tâm lý' AND m.title = 'The Shawshank Redemption'
UNION ALL SELECT m.movie_id, g.genre_id FROM movies m, genres g WHERE g.genre_name = 'Tình cảm' AND m.title = 'The Shawshank Redemption';
