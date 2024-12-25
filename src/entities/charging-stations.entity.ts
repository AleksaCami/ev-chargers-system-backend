import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { OfficeEntity } from './office.entity';


@Entity('charging_stations')
export class ChargingStationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'station_name', type: 'varchar', length: 255, unique: true })
  stationName: string;

  @ManyToOne(() => OfficeEntity, (office) => office.id)
  @JoinColumn({ name: 'office_id' })
  office: OfficeEntity;

  @Column({ name: 'is_available', type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ name: 'last_used_at', type: 'timestamp', nullable: true })
  lastUsedAt: Date;

  @Column({ name: 'last_used_by', type: 'varchar', nullable: true })
  lastUsedBy: string;

  @Column({ name: 'is_in_use', type: 'boolean', default: false })
  isInUse: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
