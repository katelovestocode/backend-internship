import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuizWorkflow1699893900128 implements MigrationInterface {
    name = 'AddQuizWorkflow1699893900128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quiz_attempts" ("id" SERIAL NOT NULL, "questionResponses" json NOT NULL, "score" integer NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "quizId" integer, "companyId" integer, CONSTRAINT "PK_a84a93fb092359516dc5b325b90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "averageScoreWithinCompany" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "overallRatingAcrossSystem" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "quiz_attempts" ADD CONSTRAINT "FK_ff7b1d71fabdc7e1f4aff552859" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_attempts" ADD CONSTRAINT "FK_23f2bbe9288b221b1b377372782" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_attempts" ADD CONSTRAINT "FK_7f4338adf645c5d95cb11509544" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_attempts" DROP CONSTRAINT "FK_7f4338adf645c5d95cb11509544"`);
        await queryRunner.query(`ALTER TABLE "quiz_attempts" DROP CONSTRAINT "FK_23f2bbe9288b221b1b377372782"`);
        await queryRunner.query(`ALTER TABLE "quiz_attempts" DROP CONSTRAINT "FK_ff7b1d71fabdc7e1f4aff552859"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "overallRatingAcrossSystem"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "averageScoreWithinCompany"`);
        await queryRunner.query(`DROP TABLE "quiz_attempts"`);
    }

}
