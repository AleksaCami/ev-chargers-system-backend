import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ChargingStationEntity } from './charging-stations.entity';
import { OfficeEntity } from './office.entity';
import { UserEntity } from './user.entity';

@Entity('charging_sessions')
export class ChargingSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ChargingStationEntity, (station) => station.id)
  @JoinColumn({ name: 'charging_station_id' })
  chargingStation: ChargingStationEntity;

  @ManyToOne(() => OfficeEntity, (office) => office.id)
  @JoinColumn({ name: 'office_id' })
  office: OfficeEntity;

  @Column({ name: 'start_time', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;

  @Column({ name: 'duration_minutes', type: 'int', nullable: true })
  durationMinutes: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
