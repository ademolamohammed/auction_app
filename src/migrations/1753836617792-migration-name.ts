import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1753836617792 implements MigrationInterface {
    name = 'MigrationName1753836617792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phoneNo\` \`phoneNo\` int NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phoneNo\` \`phoneNo\` int NOT NULL`);
    }

}
