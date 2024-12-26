import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateRefreshTokensTable1735166022632 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'refresh_tokens',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment',
					},
					{
						name: 'access_token_id',
						type: 'int',
						isNullable: false,
					},
					{
						name: 'token',
						type: 'varchar',
						isUnique: true,
					},
					{
						name: 'expires_at',
						type: 'timestamp with time zone',
					},
					{
						name: 'created_at',
						type: 'timestamp with time zone',
						default: 'CURRENT_TIMESTAMP',
					},
					{
						name: 'updated_at',
						type: 'timestamp with time zone',
						default: 'CURRENT_TIMESTAMP',
					},
				],
			}),
		);

		// Create foreign key for 'access_token_id'
		await queryRunner.createForeignKey(
			'refresh_tokens',
			new TableForeignKey({
				columnNames: ['access_token_id'],
				referencedTableName: 'access_tokens',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('refresh_tokens');
		const accessTokenForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('access_token_id') !== -1);
		if (accessTokenForeignKey) {
			await queryRunner.dropForeignKey('refresh_tokens', accessTokenForeignKey);
		}

		await queryRunner.dropTable('refresh_tokens');
	}

}
