-- V9: Seed diễn viên, đạo diễn, tập phim (phụ thuộc V4 movies)

-- Diễn viên
INSERT INTO actors (full_name, gender, birth_date, nationality, biography, image_url) VALUES
('Sam Worthington', 'Nam', '1976-08-02', 'Australia', NULL, NULL),
('Zoe Saldaña', 'Nữ', '1978-06-19', 'Mỹ', NULL, NULL),
('Robert Downey Jr.', 'Nam', '1965-04-04', 'Mỹ', NULL, NULL),
('Lee Jung-jae', 'Nam', '1972-12-15', 'Hàn Quốc', NULL, NULL),
('Park Hae-soo', 'Nam', '1981-11-21', 'Hàn Quốc', NULL, NULL),
('Song Kang-ho', 'Nam', '1967-01-17', 'Hàn Quốc', NULL, NULL),
('Christian Bale', 'Nam', '1974-01-30', 'Anh', NULL, NULL),
('Christopher Nolan', 'Nam', '1970-07-30', 'Anh', NULL, NULL),
('Bong Joon-ho', 'Nam', '1969-09-14', 'Hàn Quốc', NULL, NULL),
('James Cameron', 'Nam', '1954-08-16', 'Canada', NULL, NULL),
('Anthony Russo', 'Nam', '1970-02-03', 'Mỹ', NULL, NULL),
('Bryan Cranston', 'Nam', '1956-03-07', 'Mỹ', NULL, NULL),
('Aaron Paul', 'Nam', '1979-08-27', 'Mỹ', NULL, NULL),
('Vince Gilligan', 'Nam', '1967-02-10', 'Mỹ', NULL, NULL);

-- Đạo diễn (id 1-7)
INSERT INTO directors (full_name, birth_date, awards, biography) VALUES
('James Cameron', '1954-08-16', NULL, NULL),
('Anthony Russo', '1970-02-03', NULL, NULL),
('Joe Russo', '1971-07-08', NULL, NULL),
('Christopher Nolan', '1970-07-30', NULL, NULL),
('Bong Joon-ho', '1969-09-14', NULL, NULL),
('Vince Gilligan', '1967-02-10', NULL, NULL),
('Frank Darabont', '1959-01-28', NULL, NULL);

-- Liên kết phim - diễn viên (movie_id từ bảng movies: 1 Avatar, 2 Avengers, 3 Squid Game, 4 Parasite, 5 Spirited Away, 6 Dark Knight, 7 Inception, 8 Your Name, 9 Breaking Bad, 10 Shawshank)
INSERT IGNORE INTO movies_actors (movie_id, actor_id, character_name) VALUES
(1, 1, 'Jake Sully'),
(1, 2, 'Neytiri'),
(2, 3, 'Tony Stark / Iron Man'),
(3, 4, 'Seong Gi-hun'),
(3, 5, 'Cho Sang-woo'),
(4, 6, 'Kim Ki-taek'),
(6, 7, 'Bruce Wayne / Batman'),
(7, 7, 'Cobb'),
(9, 12, 'Walter White'),
(9, 13, 'Jesse Pinkman');

-- Liên kết phim - đạo diễn
INSERT IGNORE INTO movies_directors (movie_id, director_id) VALUES
(1, 1),
(2, 2),
(2, 3),
(6, 4),
(7, 4),
(4, 5),
(9, 6),
(10, 7);

-- Tập phim cho Squid Game (movie_id = 3, 9 tập) và Breaking Bad (movie_id = 9, vài tập mẫu)
INSERT INTO episodes (movie_id, episode_number, video_url, release_time) VALUES
(3, 1, '/videos/sample.mp4', NOW()),
(3, 2, '/videos/sample.mp4', NOW()),
(3, 3, '/videos/sample.mp4', NOW()),
(3, 4, '/videos/sample.mp4', NOW()),
(3, 5, '/videos/sample.mp4', NOW()),
(3, 6, '/videos/sample.mp4', NOW()),
(3, 7, '/videos/sample.mp4', NOW()),
(3, 8, '/videos/sample.mp4', NOW()),
(3, 9, '/videos/sample.mp4', NOW()),
(9, 1, '/videos/sample.mp4', NOW()),
(9, 2, '/videos/sample.mp4', NOW()),
(9, 3, '/videos/sample.mp4', NOW()),
(9, 4, '/videos/sample.mp4', NOW()),
(9, 5, '/videos/sample.mp4', NOW());
