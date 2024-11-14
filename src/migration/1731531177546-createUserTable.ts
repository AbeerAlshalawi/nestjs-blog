import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1731531177546 implements MigrationInterface {
    name = 'CreateUserTable1731531177546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Articles" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "body" character varying NOT NULL, CONSTRAINT "PK_855d4c8e93574fddefaab9225c6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Articles"`);
        await queryRunner.query(`DROP TABLE "Users"`);
    }

}
