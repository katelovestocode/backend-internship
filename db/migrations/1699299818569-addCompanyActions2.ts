import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompanyActions21699299818569 implements MigrationInterface {
    name = 'AddCompanyActions21699299818569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."requests_status_enum" AS ENUM('pending', 'accepted', 'declined')`);
        await queryRunner.query(`ALTER TABLE "requests" ADD "status" "public"."requests_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "invitations" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."invitations_status_enum" AS ENUM('pending', 'accepted', 'declined')`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD "status" "public"."invitations_status_enum" NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitations" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."invitations_status_enum"`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "requests" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."requests_status_enum"`);
        await queryRunner.query(`ALTER TABLE "requests" ADD "status" character varying NOT NULL`);
    }

}
