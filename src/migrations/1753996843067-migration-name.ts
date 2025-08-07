import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1753996843067 implements MigrationInterface {
    name = 'MigrationName1753996843067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`bids\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(15,2) NOT NULL, \`productId\` int NOT NULL, \`bidderId\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`bids\` ADD CONSTRAINT \`FK_ed46f16a2ffae8257bf85249562\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bids\` ADD CONSTRAINT \`FK_fe34abd3aeb153efaea7a03c676\` FOREIGN KEY (\`bidderId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bids\` DROP FOREIGN KEY \`FK_fe34abd3aeb153efaea7a03c676\``);
        await queryRunner.query(`ALTER TABLE \`bids\` DROP FOREIGN KEY \`FK_ed46f16a2ffae8257bf85249562\``);
        await queryRunner.query(`DROP TABLE \`bids\``);
    }

}
