import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1754363579665 implements MigrationInterface {
    name = 'MigrationName1754363579665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`isNotificationSent\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`isNotificationSent\``);
    }

}
