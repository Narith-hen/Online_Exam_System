import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable implements MigrationInterface {
  name = 'CreateUsersTable';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password_hash',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'datetime',
            precision: 3,
            default: 'CURRENT_TIMESTAMP(3)',
            isNullable: false,
          },
        ],
        indices: [{ name: 'uq_users_email', columnNames: ['email'], isUnique: true }],
        engine: 'InnoDB',
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true);
  }
}
