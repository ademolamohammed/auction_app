import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1754037925094 implements MigrationInterface {
    name = 'MigrationName1754037925094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bids\` DROP FOREIGN KEY \`FK_ed46f16a2ffae8257bf85249562\``);
        await queryRunner.query(`ALTER TABLE \`bids\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bids\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`bids\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`bids\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`bids\` DROP COLUMN \`productId\``);
        await queryRunner.query(`ALTER TABLE \`bids\` ADD \`productId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`bids\` ADD CONSTRAINT \`FK_ed46f16a2ffae8257bf85249562\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bids\` DROP FOREIGN KEY \`FK_ed46f16a2ffae8257bf85249562\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`bids\` DROP COLUMN \`productId\``);
        await queryRunner.query(`ALTER TABLE \`bids\` ADD \`productId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bids\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`bids\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`bids\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`bids\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`bids\` ADD CONSTRAINT \`FK_ed46f16a2ffae8257bf85249562\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
