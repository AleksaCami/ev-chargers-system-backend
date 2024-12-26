import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AccessTokenEntity } from './oauth-access-token.entity';

@Entity('refresh_tokens')
export class RefreshTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'access_token_id' })
  accessTokenId: number;

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

  // One -> one
  @OneToOne(() => AccessTokenEntity, (accessToken) => accessToken.refreshToken, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'access_token_id', referencedColumnName: 'id' }])
  accessToken?: AccessTokenEntity;
}
