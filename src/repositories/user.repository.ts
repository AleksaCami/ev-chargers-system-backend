import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  protected alias: string;

  constructor(@InjectRepository(UserEntity) protected repo: Repository<UserEntity>) {
    super(repo);
    this.alias = 'user';
  }

  /**
 * Finds user by id.
 * @param {number} id
 * @returns User if found.
 */
  findById(id: number): Promise<UserEntity | null> {
    return this.qb()
      .where(`${this.alias}.id = :id`, { id })
      .getOne();
  }

  /**
   * Finds user by email.
   * @param {string} email
   * @returns User if found.
   */
  findByEmail(email: string): Promise<UserEntity | null> {
    return this.qb()
      .where(`${this.alias}.email = :email`, { email })
      .getOne();
  }

  /**
   * Finds a user by email with credentials loaded.
   * @param {string} email
   * @returns User if found.
   */
  findWithCredentials(email: string): Promise<UserEntity | null> {
    return (
      this.qb()
        .addSelect(`${this.alias}.password`)
        .where(`${this.alias}.email = :email`, { email })
        .getOne()
    );
  }
}
