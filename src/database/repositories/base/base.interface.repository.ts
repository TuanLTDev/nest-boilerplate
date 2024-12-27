import { FilterQuery, QueryOptions } from 'mongoose';
import { BaseEntity } from '@database/entities/base/base.entity';

export interface BaseRepositoryInterface<T extends BaseEntity> {
  create(dto: T | any): Promise<T>;

  findOneById(id: string, options?: QueryOptions<T>): Promise<T>;

  findOneByCondition(condition?: FilterQuery<T>, options?: QueryOptions<T>): Promise<T>;

  findAll(condition?: FilterQuery<T>, options?: QueryOptions<T>): Promise<Array<T>>;

  findByIdAndUpdate(id: string, dto?: Partial<T> | any, options?: QueryOptions<T>): Promise<T>;

  findOneAndUpdate(condition?: FilterQuery<T>, dto?: Partial<T> | any, options?: QueryOptions<T>): Promise<T>;

  countDocuments(condition?: FilterQuery<T>): Promise<number>;

  update(id: string, dto: Partial<T> | any, options?: QueryOptions<T>): Promise<T>;

  softDelete(id: string): Promise<boolean>;

  permanentlyDelete(id: string): Promise<boolean>;

  insertMany(items: T[]): Promise<T[]>;

  bulkWrite(items: T[], properties: Extract<keyof T, string>[]): Promise<any>;

  bulkDelete(conditions: Array<FilterQuery<T>>): Promise<any>;

  updateMany(condition: FilterQuery<T>, dto: Partial<T> | any): Promise<any>;

  deleteMany(condition: FilterQuery<T>): Promise<any>;
}
