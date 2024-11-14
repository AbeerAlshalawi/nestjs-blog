import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateArticleAndUser1731562459044 implements MigrationInterface {
    name = 'UpdateArticleAndUser1731562459044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Articles" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "Articles" ADD CONSTRAINT "FK_ab2255dda0611f1aa53a196ca5b" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Articles" DROP CONSTRAINT "FK_ab2255dda0611f1aa53a196ca5b"`);
        await queryRunner.query(`ALTER TABLE "Articles" DROP COLUMN "userId"`);
    }

}
