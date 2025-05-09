import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDb1741598562634 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "categories" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "deleted_at" TIMESTAMP,
                "parent_id" uuid,
                CONSTRAINT "PK_category_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "phone_designs" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "color" character varying NOT NULL,
                "image_url" character varying NOT NULL,
                "deleted_at" TIMESTAMP,
                "phone_id" uuid,
                CONSTRAINT "PK_phone_design_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "phones" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "brand" character varying NOT NULL,
                "model" character varying NOT NULL,
                "image_url" character varying NOT NULL,
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_phone_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "cases" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "image_url" character varying NOT NULL,
                "description" text,
                "price" numeric(10, 2) NOT NULL,
                "buy_link" character varying NOT NULL,
                "deleted_at" TIMESTAMP,
                "phone_id" uuid,
                "category_id" uuid,
                CONSTRAINT "PK_case_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "likes" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "session_id" character varying NOT NULL,
                "deleted_at" TIMESTAMP,
                "case_id" uuid,
                CONSTRAINT "UQ_d1e8196941b85441f274ebb0654" UNIQUE ("session_id", "case_id"),
                CONSTRAINT "PK_like_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "categories"
            ADD CONSTRAINT "FK_parent_id" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "phone_designs"
            ADD CONSTRAINT "FK_phone_design_phone_id" FOREIGN KEY ("phone_id") REFERENCES "phones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "cases"
            ADD CONSTRAINT "FK_case_phone_id" FOREIGN KEY ("phone_id") REFERENCES "phones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "cases"
            ADD CONSTRAINT "FK_case_category_id" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "likes"
            ADD CONSTRAINT "FK_case_like_id" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "likes" DROP CONSTRAINT "FK_case_like_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "cases" DROP CONSTRAINT "FK_case_category_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "cases" DROP CONSTRAINT "FK_case_phone_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "phone_designs" DROP CONSTRAINT "FK_phone_design_phone_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "categories" DROP CONSTRAINT "FK_parent_id"
        `);
    await queryRunner.query(`
            DROP TABLE "likes"
        `);
    await queryRunner.query(`
            DROP TABLE "cases"
        `);
    await queryRunner.query(`
            DROP TABLE "phones"
        `);
    await queryRunner.query(`
            DROP TABLE "phone_designs"
        `);
    await queryRunner.query(`
            DROP TABLE "categories"
        `);
  }
}
