import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateChargingSessionsTable1735165327860 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'charging_sessions',
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
						name: 'charging_station_id',
						type: 'int',
						isNullable: false,
					},
					{
						name: 'office_id',
						type: 'int',
						isNullable: false,
					},
					{
						name: 'start_time',
						type: 'timestamp',
						default: 'CURRENT_TIMESTAMP',
					},
					{
						name: 'end_time',
						type: 'timestamp',
						isNullable: true, // Nullable in case the session is still ongoing
					},
					{
						name: 'is_active',
						type: 'boolean',
						default: false,
					},
					{
						name: 'duration_minutes',
						type: 'int',
						isNullable: true, // Nullable, will be set after the session ends
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
			'charging_sessions',
			new TableForeignKey({
				columnNames: ['user_id'],
				referencedTableName: 'users',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE', // If the user is deleted, delete all their charging sessions
			}),
		);

		await queryRunner.createForeignKey(
			'charging_sessions',
			new TableForeignKey({
				columnNames: ['charging_station_id'],
				referencedTableName: 'charging_stations',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE', // If the charging station is deleted, delete all sessions using it
			}),
		);

		await queryRunner.createForeignKey(
			'charging_sessions',
			new TableForeignKey({
				columnNames: ['office_id'],
				referencedTableName: 'offices',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE', // If the office is deleted, delete all associated charging sessions
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('charging_sessions');
		const userForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
		if (userForeignKey) {
			await queryRunner.dropForeignKey('charging_sessions', userForeignKey);
		}

		const stationForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('charging_station_id') !== -1);
		if (stationForeignKey) {
			await queryRunner.dropForeignKey('charging_sessions', stationForeignKey);
		}

		const officeForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('office_id') !== -1);
		if (officeForeignKey) {
			await queryRunner.dropForeignKey('charging_sessions', officeForeignKey);
		}

		await queryRunner.dropTable('charging_sessions');
	}


}
