import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1732797153733 implements MigrationInterface {
    name = 'UpdateUserTable1732797153733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_articles_on_title"`);
        await queryRunner.query(`DROP INDEX "public"."idx_users_on_username"`);
        await queryRunner.query(`DROP INDEX "public"."idx_users_on_gender"`);
        await queryRunner.query(`DROP INDEX "public"."idx_follow_on_follower_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "followersCount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "followingsCount" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "followingsCount"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "followersCount"`);
        await queryRunner.query(`CREATE INDEX "idx_follow_on_follower_id" ON "follow" ("followerId") `);
        await queryRunner.query(`CREATE INDEX "idx_users_on_gender" ON "users" ("gender") `);
        await queryRunner.query(`CREATE INDEX "idx_users_on_username" ON "users" ("username") `);
        await queryRunner.query(`CREATE INDEX "idx_articles_on_title" ON "articles" ("title") `);
    }

}
