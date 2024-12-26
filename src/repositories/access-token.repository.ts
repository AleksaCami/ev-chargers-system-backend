import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AccessTokenEntity } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class AccessTokenRepository extends BaseRepository<AccessTokenEntity> {
  protected alias: string;

  constructor(
    @InjectRepository(AccessTokenEntity)
    protected repo: Repository<AccessTokenEntity>,
  ) {
    super(repo);
    this.alias = 'accessToken';
  }

  /**
    * Finds an OAuthAccessToken by the given token value.
    * Loads the following relations:
    * - User
    * @param token - Access token's token value.
    * @returns OAuthAccessToken.
    */
  findByToken(token: string): Promise<AccessTokenEntity | null> {
    return this.qb()
      .where(`${this.alias}.token = :token`, { token })
      .innerJoinAndSelect(`${this.alias}.user`, 'user')
      .getOne();
  }
}
