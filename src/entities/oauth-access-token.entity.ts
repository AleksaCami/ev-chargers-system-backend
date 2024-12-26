import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RefreshTokenEntity } from './oauth-refresh-token.entity';
import { UserEntity } from './user.entity';

@Entity('access_tokens')
export class AccessTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'token', type: 'varchar', unique: true })
  token: string;

  @Column({
    type: 'timestamp with time zone',
    name: 'expires_at',
  })
  expiresAt: Date;

  // Timestamps
  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'created_at',
    select: false,
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updated_at',
    select: false,
  })
  updatedAt?: Date;


  // One -> One
  @OneToOne(() => RefreshTokenEntity, (refreshToken) => refreshToken.accessToken)
  refreshToken?: RefreshTokenEntity;
}
