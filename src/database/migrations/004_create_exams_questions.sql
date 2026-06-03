-- MySQL migration: exams and questions tables
USE `online_exam_system`;

CREATE TABLE IF NOT EXISTS `exams` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `exam_title` VARCHAR(255) NOT NULL,
  `exam_code` VARCHAR(12) NOT NULL,
  `duration_minutes` INT NULL,
  `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_exams_exam_code` (`exam_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `questions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `question_text` VARCHAR(255) NOT NULL,
  `options` TEXT NOT NULL,
  `correct_answer` VARCHAR(255) NOT NULL,
  `exam_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_questions_exam_id` (`exam_id`),
  CONSTRAINT `fk_questions_exam_id`
    FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
