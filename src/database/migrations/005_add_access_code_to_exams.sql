ALTER TABLE `exams` ADD COLUMN `accessCode` varchar(20) NULL;
CREATE UNIQUE INDEX `IDX_exams_accessCode` ON `exams` (`accessCode`);
