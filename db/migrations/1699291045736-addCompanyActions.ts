import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompanyActions1699291045736 implements MigrationInterface {
    name = 'AddCompanyActions1699291045736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" ADD "status" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requests" DROP COLUMN "status"`);
    }

}
