import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAccessCodeToExams20260602000000 implements MigrationInterface {
  name = "AddAccessCodeToExams20260602000000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `exams` ADD `accessCode` varchar(20) NULL"
    );
    await queryRunner.query(
      "ALTER TABLE `exams` ADD UNIQUE INDEX `IDX_exams_accessCode` (`accessCode`)"
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `exams` DROP INDEX `IDX_exams_accessCode`"
    );
    await queryRunner.query("ALTER TABLE `exams` DROP COLUMN `accessCode`");
  }
}
