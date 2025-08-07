import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1754000472844 implements MigrationInterface {
    name = 'MigrationName1754000472844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_e40a1dd2909378f0da1f34f7bd6\``);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`sellerId\` \`sellerId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_e40a1dd2909378f0da1f34f7bd6\` FOREIGN KEY (\`sellerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_e40a1dd2909378f0da1f34f7bd6\``);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`sellerId\` \`sellerId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_e40a1dd2909378f0da1f34f7bd6\` FOREIGN KEY (\`sellerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
