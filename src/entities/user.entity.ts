import * as bcrypt from 'bcryptjs';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AccessTokenEntity } from './oauth-access-token.entity';
import { OfficeEntity } from './office.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @ManyToOne(() => OfficeEntity, (office) => office.id)
  @JoinColumn({ name: 'office_id' })
  office: OfficeEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // One user can have multiple access tokens
  @OneToMany(() => AccessTokenEntity, (accessToken) => accessToken.user)
  accessTokens: AccessTokenEntity[];

  // Current Auth Token
  private currentAuthToken?: AccessTokenEntity | null;

  setCurrentAuthToken(token: AccessTokenEntity): void {
    this.currentAuthToken = token;
  }

  getCurrentAuthToken(): AccessTokenEntity | null | undefined {
    return this.currentAuthToken;
  }

  /**
   * Hashes password.
   * @param password - Password.
   * @returns
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 1);
  }
}
