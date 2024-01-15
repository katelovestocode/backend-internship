import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuizzes1699620020860 implements MigrationInterface {
    name = 'AddQuizzes1699620020860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "questions" ("id" SERIAL NOT NULL, "question" character varying NOT NULL, "answers" text array NOT NULL, "correctAnswer" character varying NOT NULL, "quizId" integer, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quizzes" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "frequencyInDays" integer NOT NULL, "companyId" integer, CONSTRAINT "PK_b24f0f7662cf6b3a0e7dba0a1b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_35d54f06d12ea78d4842aed6b6d" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD CONSTRAINT "FK_5b10313e300a524a79e4216d20f" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quizzes" DROP CONSTRAINT "FK_5b10313e300a524a79e4216d20f"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_35d54f06d12ea78d4842aed6b6d"`);
        await queryRunner.query(`DROP TABLE "quizzes"`);
        await queryRunner.query(`DROP TABLE "questions"`);
    }

}
