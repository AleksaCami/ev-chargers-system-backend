import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateChargingStationsTable1735165203300 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'charging_stations',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment',
					},
					{
						name: 'station_name',
						type: 'varchar',
						length: '255',
						isUnique: true,
					},
					{
						name: 'office_id',
						type: 'int',
						isNullable: true, // Nullable in case the station isn't assigned to an office initially
					},
					{
						name: 'is_available',
						type: 'boolean',
						default: true,
					},
					{
						name: 'last_used_at',
						type: 'timestamp',
						isNullable: true, // Nullable in case the station hasn't been used yet
					},
					{
						name: 'last_used_by',
						type: 'varchar',
						isNullable: true, // Nullable if the station hasn't been used yet
					},
					{
						name: 'is_in_use',
						type: 'boolean',
						default: false,
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

		// Create foreign key for 'office_id'
		await queryRunner.createForeignKey(
			'charging_stations',
			new TableForeignKey({
				columnNames: ['office_id'],
				referencedTableName: 'offices',
				referencedColumnNames: ['id'],
				onDelete: 'SET NULL', // When the referenced office is deleted, set office_id to NULL
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('charging_stations');
		const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('office_id') !== -1);
		if (foreignKey) {
			await queryRunner.dropForeignKey('charging_stations', foreignKey);
		}

		await queryRunner.dropTable('charging_stations');
	}

}
