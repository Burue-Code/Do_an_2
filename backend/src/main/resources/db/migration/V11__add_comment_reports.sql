-- V11__add_comment_reports.sql
-- Add comment reports for moderation

CREATE TABLE IF NOT EXISTS comment_reports (
    report_id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    comment_id        BIGINT       NOT NULL,
    reporter_user_id  BIGINT       NOT NULL,
    reason            VARCHAR(255) NULL,
    created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved          TINYINT(1)   NOT NULL DEFAULT 0,
    resolved_at       DATETIME     NULL,
    CONSTRAINT fk_comment_reports_comment
        FOREIGN KEY (comment_id) REFERENCES comments (comment_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_comment_reports_reporter
        FOREIGN KEY (reporter_user_id) REFERENCES users (user_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE KEY uq_comment_report_once (comment_id, reporter_user_id),
    INDEX idx_comment_reports_comment (comment_id),
    INDEX idx_comment_reports_resolved (resolved)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

