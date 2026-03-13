-- Schema MySQL cho hệ thống gợi ý phim theo thể loại
-- Phù hợp với ERD trong docs/resources/erd.plantuml

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Tạo database (tùy chỉnh tên theo môi trường)
CREATE DATABASE IF NOT EXISTS movie_recommendation
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE movie_recommendation;

-- Bảng ROLE
CREATE TABLE roles (
    role_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name   VARCHAR(100) NOT NULL UNIQUE
) ENGINE = InnoDB;

-- Bảng USERS
CREATE TABLE users (
    user_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_id       BIGINT NOT NULL,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(100) NOT NULL,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES roles (role_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB;

-- Bảng GENRE
CREATE TABLE genres (
    genre_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    genre_name VARCHAR(100) NOT NULL UNIQUE
) ENGINE = InnoDB;

-- Bảng USERS_GENRE (thể loại yêu thích)
CREATE TABLE users_genre (
    user_id  BIGINT NOT NULL,
    genre_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, genre_id),
    CONSTRAINT fk_users_genre_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_users_genre_genre
        FOREIGN KEY (genre_id) REFERENCES genres (genre_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE = InnoDB;

-- Bảng MOVIES
CREATE TABLE movies (
    movie_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    title          VARCHAR(200) NOT NULL,
    description    TEXT         NULL,
    release_year   INT          NULL,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    poster         VARCHAR(500) NULL,
    duration       INT          NULL,
    status         VARCHAR(50)  NULL,
    total_episodes INT          NULL,
    rating_score   FLOAT        NULL DEFAULT 0,
    rating_count   INT          NULL DEFAULT 0,
    movie_type     INT          NULL,
    INDEX idx_movies_title (title),
    INDEX idx_movies_status (status)
) ENGINE = InnoDB;

-- Bảng MOVIES_GENRE (liên kết phim - thể loại)
CREATE TABLE movies_genre (
    movie_id BIGINT NOT NULL,
    genre_id BIGINT NOT NULL,
    PRIMARY KEY (movie_id, genre_id),
    CONSTRAINT fk_movies_genre_movie
        FOREIGN KEY (movie_id) REFERENCES movies (movie_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_movies_genre_genre
        FOREIGN KEY (genre_id) REFERENCES genres (genre_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB;

-- Bảng EPISODES
CREATE TABLE episodes (
    episode_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    movie_id       BIGINT       NOT NULL,
    episode_number INT          NOT NULL,
    video_url      VARCHAR(500) NOT NULL,
    release_time   DATETIME     NULL,
    CONSTRAINT fk_episodes_movie
        FOREIGN KEY (movie_id) REFERENCES movies (movie_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE KEY uq_movie_episode (movie_id, episode_number)
) ENGINE = InnoDB;

-- Bảng SCHEDULES (lịch chiếu / lịch đăng)
CREATE TABLE schedules (
    schedule_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    movie_id    BIGINT       NOT NULL,
    day_of_week INT          NOT NULL,
    air_time    TIME         NOT NULL,
    note        VARCHAR(200) NULL,
    CONSTRAINT fk_schedules_movie
        FOREIGN KEY (movie_id) REFERENCES movies (movie_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE = InnoDB;

-- Bảng ACTORS
CREATE TABLE actors (
    actor_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(200) NOT NULL,
    gender      VARCHAR(20)  NULL,
    birth_date  DATE         NULL,
    nationality VARCHAR(100) NULL,
    biography   TEXT         NULL,
    image_url   VARCHAR(500) NULL
) ENGINE = InnoDB;

-- Bảng MOVIES_ACTORS (liên kết phim - diễn viên)
CREATE TABLE movies_actors (
    movie_id       BIGINT NOT NULL,
    actor_id       BIGINT NOT NULL,
    character_name VARCHAR(200) NULL,
    PRIMARY KEY (movie_id, actor_id),
    CONSTRAINT fk_movies_actors_movie
        FOREIGN KEY (movie_id) REFERENCES movies (movie_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_movies_actors_actor
        FOREIGN KEY (actor_id) REFERENCES actors (actor_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB;

-- Bảng DIRECTORS
CREATE TABLE directors (
    director_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(200) NOT NULL,
    birth_date  DATE         NULL,
    awards      TEXT         NULL,
    biography   TEXT         NULL
) ENGINE = InnoDB;

-- Bảng MOVIES_DIRECTORS (liên kết phim - đạo diễn)
CREATE TABLE movies_directors (
    movie_id   BIGINT NOT NULL,
    director_id BIGINT NOT NULL,
    PRIMARY KEY (movie_id, director_id),
    CONSTRAINT fk_movies_directors_movie
        FOREIGN KEY (movie_id) REFERENCES movies (movie_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_movies_directors_director
        FOREIGN KEY (director_id) REFERENCES directors (director_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB;

-- Bảng COMMENTS
CREATE TABLE comments (
    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT   NOT NULL,
    movie_id   BIGINT   NOT NULL,
    content    TEXT     NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_comments_movie
        FOREIGN KEY (movie_id) REFERENCES movies (movie_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE = InnoDB;

-- Bảng RATINGS
CREATE TABLE ratings (
    rating_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT   NOT NULL,
    movie_id     BIGINT   NOT NULL,
    rating_value INT      NOT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ratings_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_ratings_movie
        FOREIGN KEY (movie_id) REFERENCES movies (movie_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE KEY uq_user_movie_rating (user_id, movie_id)
) ENGINE = InnoDB;

-- Bảng LIKES (user thích phim)
CREATE TABLE likes (
    user_id    BIGINT   NOT NULL,
    movie_id   BIGINT   NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, movie_id),
    CONSTRAINT fk_likes_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_likes_movie
        FOREIGN KEY (movie_id) REFERENCES movies (movie_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE = InnoDB;

-- Bảng WATCHLIST_ITEMS (phim theo dõi)
CREATE TABLE watchlist_items (
    watchlist_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT   NOT NULL,
    movie_id     BIGINT   NOT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_watchlist_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_watchlist_movie
        FOREIGN KEY (movie_id) REFERENCES movies (movie_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE KEY uq_watchlist_user_movie (user_id, movie_id)
) ENGINE = InnoDB;

-- Bảng WATCH_LOGS (lịch sử xem)
CREATE TABLE watch_logs (
    log_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT   NOT NULL,
    movie_id        BIGINT   NOT NULL,
    episode_id      BIGINT   NULL,
    duration_watched INT      NULL,
    completed       TINYINT(1) NOT NULL DEFAULT 0,
    last_watched_at DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_watch_logs_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_watch_logs_movie
        FOREIGN KEY (movie_id) REFERENCES movies (movie_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_watch_logs_episode
        FOREIGN KEY (episode_id) REFERENCES episodes (episode_id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_watch_logs_user (user_id),
    INDEX idx_watch_logs_movie (movie_id)
) ENGINE = InnoDB;

-- Bảng SEARCH_HISTORY (lịch sử tìm kiếm)
CREATE TABLE search_history (
    history_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT   NOT NULL,
    keyword    VARCHAR(200) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_search_history_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    INDEX idx_search_history_user (user_id),
    INDEX idx_search_history_keyword (keyword)
) ENGINE = InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

