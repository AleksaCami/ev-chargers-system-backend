import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUsersTable1735165050672 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Create 'users' table
		await queryRunner.createTable(
			new Table({
				name: 'users',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment',
					},
					{
						name: 'email',
						type: 'varchar',
						length: '255',
						isUnique: true,
					},
					{
						name: 'full_name',
						type: 'varchar',
						length: '255',
					},
					{
						name: 'office_id',
						type: 'int',
						isNullable: true, // This is nullable to allow users to be added without an office initially
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
			'users',
			new TableForeignKey({
				columnNames: ['office_id'],
				referencedTableName: 'offices',
				referencedColumnNames: ['id'],
				onDelete: 'SET NULL', // When the referenced office is deleted, set office_id to NULL
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const table = await queryRunner.getTable('users');
		const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('office_id') !== -1);
		if (foreignKey) {
			await queryRunner.dropForeignKey('users', foreignKey);
		}

		await queryRunner.dropTable('users');
	}

}
