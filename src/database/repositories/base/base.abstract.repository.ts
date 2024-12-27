import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { BaseRepositoryInterface } from './base.interface.repository';
import { BaseEntity } from '@database/entities/base/base.entity';

export abstract class BaseRepositoryAbstract<T extends BaseEntity> implements BaseRepositoryInterface<T> {
  protected constructor(private readonly model: Model<T>) {
    this.model = model;
  }

  async create(dto: T | any): Promise<T> {
    const created_data = await this.model.create(dto);
    return created_data.save();
  }

  async findOneById(id: string, options?: QueryOptions<T>): Promise<T> {
    const item = await this.model.findById(id, options?.projection, options).exec();
    return item?.deletedAt ? null : item;
  }

  async findOneByCondition(condition: FilterQuery<T> = {}, options: QueryOptions<T>): Promise<T> {
    return this.model.findOne({ ...condition, deletedAt: null }, options?.projection, options).exec();
  }

  async findAll(condition: FilterQuery<T> = {}, options?: QueryOptions<T>): Promise<Array<T>> {
    return this.model.find({ ...condition, deletedAt: null }, options?.projection, options);
  }

  async findByIdAndUpdate(id: string, dto: Partial<T> | any, options?: QueryOptions<T>): Promise<T> {
    return this.model.findByIdAndUpdate(id, dto, options).exec();
  }

  async findOneAndUpdate(condition: FilterQuery<T> = {}, dto: Partial<T> | any, options?: QueryOptions<T>): Promise<T> {
    return this.model.findOneAndUpdate(condition, dto, options).exec();
  }

  async countDocuments(condition: FilterQuery<T> = {}): Promise<number> {
    return this.model
      .countDocuments({ ...condition, deletedAt: null })
      .lean()
      .exec();
  }

  async update(id: string, dto: Partial<T> | any, options?: QueryOptions<T>): Promise<T> {
    return this.model.findOneAndUpdate({ _id: id }, dto, options);
  }

  async softDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }

    return !!(await this.model
      .findByIdAndUpdate<T>(id, {
        deletedAt: new Date(),
      })
      .exec());
  }

  async permanentlyDelete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }
    return !!(await this.model.findByIdAndDelete(id));
  }

  async insertMany(items: T[]): Promise<T[]> {
    return (await this.model.insertMany(items)) as unknown as T[];
  }

  async bulkWrite(items: T[], properties: Extract<keyof T, string>[]) {
    const filter: any = {};
    const operations = items.map((item: T) => {
      properties.forEach((property) => {
        filter[property] = item[property];
      });
      return {
        updateOne: {
          filter: { ...filter },
          update: { $set: { ...item, _id: undefined } },
          upsert: true,
        },
      };
    });

    return this.model.bulkWrite(operations);
  }

  async bulkDelete(conditions: Array<FilterQuery<T>>) {
    const operations = conditions.map((condition) => {
      return {
        updateOne: {
          filter: condition,
          update: { $set: { deletedAt: new Date() } },
          upsert: true,
        },
      };
    });

    return this.model.bulkWrite(operations);
  }

  updateMany(condition: FilterQuery<T>, dto: Partial<T> | any): Promise<any> {
    return this.model.updateMany(condition, dto).exec();
  }

  async deleteMany(condition: FilterQuery<T>) {
    return this.model.deleteMany(condition).exec();
  }
}
