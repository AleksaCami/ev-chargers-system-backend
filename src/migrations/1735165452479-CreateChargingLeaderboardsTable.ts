import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateChargingLeaderboardsTable1735165452479 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'charging_leaderboard',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment',
					},
					{
						name: 'user_id',
						type: 'int',
						isNullable: false,
					},
					{
						name: 'total_charging_time',
						type: 'int',
						default: 0, // Total charging time (in minutes)
					},
					{
						name: 'session_count',
						type: 'int',
						default: 0, // Number of sessions completed by the user
					},
					{
						name: 'created_at',
						type: 'timestamp',
						default: 'CURRENT_TIMESTAMP',
					},
					{
						name: 'updated_at',
						type: 'timestamp',
						default: 'CURRENT_TIMESTAMP',
					},
				],
			}),
		);

		await queryRunner.createForeignKey(
			'charging_leaderboard',
			new TableForeignKey({
				columnNames: ['user_id'],
				referencedTableName: 'users',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE', // If the user is deleted, delete their leaderboard entry
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('charging_leaderboard');
		const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
		if (userForeignKey) {
			await queryRunner.dropForeignKey('charging_leaderboard', userForeignKey);
		}

		await queryRunner.dropTable('charging_leaderboard');
	}

}
