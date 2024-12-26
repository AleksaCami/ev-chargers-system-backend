import { FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { DeepPartial, ObjectLiteral } from '../common/contracts/global';
import { filterUndefinedKeys } from '../common/utils';

export abstract class BaseRepository<T extends ObjectLiteral> {
  /**
   * Set the table alias for the query builder.
   */
  protected abstract alias: string;

  constructor(protected readonly repo: Repository<T>) { }

  /**
   * Finds an entity by the given ID.
   * @param id - Entity's id.
   * @returns Entity or undefined.
   */
  findById(id: number | string): Promise<T | null> {
    return this.repo.findOneBy({ id } as any);
  }

  /**
   * Finds an entity by the given conditions.
   * @param criteria - Entity's find criteria.
   * @returns Entity or undefined.
   */
  findOne(criteria: FindOptionsWhere<T> = {}): Promise<T | null> {
    return this.repo.findOneBy(criteria);
  }

  /**
   * Finds entities by the given conditions.
   * @param criteria - Entity's find criteria.
   * @returns Entities.
   */
  find(criteria: FindOptionsWhere<T> = {}): Promise<T[]> {
    return this.repo.findBy(criteria);
  }

  /**
   * Creates a new entity.
   * @param data - Creation data.
   * @returns Created entity.
   */
  create<D extends DeepPartial<T>>(data: D): Promise<T> {
    return this.repo.save(this.repo.create(data));
  }

  /**
   * Updates entities by the given criteria.
   * @param criteria - Entity's find criteria.
   * @param data - Update data.
   * @returns A boolean indicating if any record has been affected.
   */
  async update(
    criteria: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<boolean> {
    const result = await this.repo.update(criteria, data);
    return !!result.affected && result.affected > 0;
  }

  /**
   * Updates the given entity.
   * @param entity - Entity to update.
   * @param data - Update data.
   */
  async updateEntity<D extends Record<string, any>>(
    entity: T,
    data: D,
  ): Promise<void> {
    Object.assign(entity, filterUndefinedKeys(data));
    await this.repo.save(entity);
  }

  /**
   * Deletes entities by the given criteria.
   * @param criteria - Entity's find criteria.
   * @returns A boolean indicating if any record has been affected.
   */
  async delete(criteria: FindOptionsWhere<T>): Promise<boolean> {
    const result = await this.repo.delete(criteria);
    return !!result.affected && result.affected > 0;
  }

  /**
   * Soft deletes entities by the given criteria.
   * @param criteria - Entity's find criteria.
   * @returns A boolean indicating if any record has been affected.
   */
  async softDelete(criteria: FindOptionsWhere<T>): Promise<boolean> {
    const result = await this.repo.softDelete(criteria);
    return !!result.affected && result.affected > 0;
  }

  /**
   * Run SELECT EXISTS query with the given conditions.
   * @param whereString - String that goes in WHERE ${whereString}
   * @param bindings - Bindings for the whereString
   * @returns Boolean indicating if any entities exist.
   */
  async exists(
    whereString: string,
    bindings: Array<string | number>,
  ): Promise<boolean> {
    const table = this.repo.metadata.tableName;
    const result = await this.repo.query(
      `SELECT EXISTS (SELECT 1 from public.${table} WHERE ${whereString})`,
      bindings,
    );
    return result[0].exists;
  }

  /**
   * Determines if the entity exists by the given id.
   * @param id - Entity's id.
   * @returns Boolean indicating if an entity exists.
   */
  existsById(id: number): Promise<boolean> {
    return this.exists('id = $1', [id]);
  }

  /**
   * Determines if the entity by the given id is not deleted.
   * @param id - Entity's id.
   * @returns Boolean indicating if an entity exists and is not deleted.
   */
  notSoftDeletedById(id: number): Promise<boolean> {
    // TypeORM will not add deleted_at IS NULL in raw queries
    return this.exists('id = $1 AND deleted_at IS NULL', [id]);
  }

  /**
   * A query builder to be used in the child repositories.
   * @returns Select query builder instance.
   */
  protected qb(): SelectQueryBuilder<T> {
    return this.repo.createQueryBuilder(this.alias);
  }
}
