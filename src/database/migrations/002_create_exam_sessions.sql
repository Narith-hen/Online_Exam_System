-- MySQL migration: exam_sessions table
USE `online_exam_system`;

CREATE TABLE IF NOT EXISTS `exam_sessions` (
  `id` VARCHAR(64) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `student_class` VARCHAR(100) NOT NULL,
  `gender` VARCHAR(50) NOT NULL,
  `institutional_email` VARCHAR(255) NOT NULL,
  `exam_code` CHAR(6) NOT NULL,
  `verified_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_exam_sessions_email_code` (`institutional_email`, `exam_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

