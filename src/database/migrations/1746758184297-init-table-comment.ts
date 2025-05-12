import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTableComment1746758184297 implements MigrationInterface {
  name = 'InitTableComment1746758184297';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "comments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "content" text NOT NULL,
        CONSTRAINT "PK_comment_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE "comments"
    `);
  }
}
