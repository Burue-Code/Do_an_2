-- V12__add_duration_minutes_to_episodes.sql
-- Thêm cột duration_minutes cho bảng episodes để khớp với entity Episode.

ALTER TABLE episodes
    ADD COLUMN duration_minutes INT NULL;

