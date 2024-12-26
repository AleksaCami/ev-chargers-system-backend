import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OfficeEntity } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class OfficeRepository extends BaseRepository<OfficeEntity> {
  protected alias: string;

  constructor(@InjectRepository(OfficeEntity) protected repo: Repository<OfficeEntity>) {
    super(repo);
    this.alias = 'office';
  }

  /**
   * Finds office by id.
   * @param {number} id
   * @returns User if found.
  */
  findById(id: number): Promise<OfficeEntity | null> {
    return this.qb()
      .where(`${this.alias}.id = :id`, { id })
      .getOne();
  }
}
