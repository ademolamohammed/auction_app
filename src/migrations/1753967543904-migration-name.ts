import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1753967543904 implements MigrationInterface {
    name = 'MigrationName1753967543904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`address\` \`address\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`address\` \`address\` varchar(255) NOT NULL`);
    }

}
