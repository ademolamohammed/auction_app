import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1753825050744 implements MigrationInterface {
    name = 'MigrationName1753825050744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`hasCurrentBid\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`hasCurrentBid\``);
    }

}
