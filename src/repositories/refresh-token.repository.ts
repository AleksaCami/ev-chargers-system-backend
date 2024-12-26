import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isPast } from 'date-fns';
import { Repository } from 'typeorm';

import { RefreshTokenEntity } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshTokenEntity> {
  protected alias: string;
  constructor(
    @InjectRepository(RefreshTokenEntity)
    protected repo: Repository<RefreshTokenEntity>,
  ) {
    super(repo);
    this.alias = 'refreshToken';
  }

  /**
   * Returns a valid refresh token by id.
   * Token is valid if it has not been revoked or is not expired.
   * Loads the following relations:
   *  - Access token
   *  - Account
   * @param id - Refresh token id.
   * @returns Refresh token if found.
   */
  async findValidById(id: string): Promise<RefreshTokenEntity | null> {
    const refreshToken = await this.qb()
      .where(`${this.alias}.id = :id`, { id })
      .innerJoinAndSelect(`${this.alias}.accessToken`, 'accessToken')
      .innerJoinAndSelect('accessToken.user', 'user')
      .getOne();

    if (
      !refreshToken ||
      isPast(refreshToken.expiresAt)
    ) {
      return null;
    }
    return refreshToken;
  }

  /**
   * Removed invalid refresh tokens.
   * @returns Delete results.
   */
  async removeInvalidTokens(): Promise<boolean> {
    const results = await this.repo
      .createQueryBuilder()
      .delete()
      .from(RefreshTokenEntity)
      .orWhere('expires_at < :now', { now: new Date() })
      .execute();
    return !!results.affected && results.affected > 0;
  }
}
