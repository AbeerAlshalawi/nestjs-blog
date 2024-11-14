import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommentsTable1731612405170 implements MigrationInterface {
    name = 'CreateCommentsTable1731612405170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Comments" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "articleId" integer, CONSTRAINT "PK_91e576c94d7d4f888c471fb43de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "FK_c49011c51cd5b37d015c5c0cf6e" FOREIGN KEY ("articleId") REFERENCES "Articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "FK_c49011c51cd5b37d015c5c0cf6e"`);
        await queryRunner.query(`DROP TABLE "Comments"`);
    }

}
