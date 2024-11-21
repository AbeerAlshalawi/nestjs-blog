import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateArticleAndComment1732137933568 implements MigrationInterface {
    name = 'UpdateArticleAndComment1732137933568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Comments" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD "content" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Articles" DROP COLUMN "body"`);
        await queryRunner.query(`ALTER TABLE "Articles" ADD "body" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Articles" DROP COLUMN "body"`);
        await queryRunner.query(`ALTER TABLE "Articles" ADD "body" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD "content" character varying NOT NULL`);
    }

}
