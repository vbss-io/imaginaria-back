import type { Document, FilterQuery, Model } from 'mongoose'

import { DatabaseEntityNotFound } from '@/domain/errors/catalog.errors'
import type { BaseRepository } from '@/domain/repositories/base.repository'

export abstract class BaseRepositoryMongoose<T extends Document, D> implements BaseRepository<T, D> {
  constructor(protected readonly model: Model<T>) {}

  private toFilterQuery(criteria: Partial<D>): FilterQuery<T> {
    const query = { ...criteria } as FilterQuery<T>
    if ('id' in query) {
      query._id = query.id as string
      delete query.id
    }
    return query
  }

  async find(criteria: Partial<D>): Promise<D[]> {
    const documents = await this.model.find(this.toFilterQuery(criteria)).exec()
    return documents.map((doc) => this.toDomain(doc))
  }

  async findOne(criteria: Partial<D>): Promise<D | null> {
    const document = await this.model.findOne(this.toFilterQuery(criteria)).exec()
    return document ? this.toDomain(document) : null
  }

  async create(data: Partial<T>): Promise<D> {
    const document = new this.model(data)
    const saved = await document.save()
    return this.toDomain(saved)
  }

  async update(criteria: Partial<D>, data: Partial<T>): Promise<D> {
    const updated = await this.model
      .findOneAndUpdate(this.toFilterQuery(criteria), { $set: data }, { new: true })
      .exec()
    if (!updated) throw new DatabaseEntityNotFound()
    return this.toDomain(updated)
  }

  async delete(criteria: Partial<D>): Promise<boolean> {
    const result = await this.model.deleteOne(this.toFilterQuery(criteria)).exec()
    return result.deletedCount > 0
  }

  async findById(id: string | number): Promise<D | null> {
    const document = await this.model.findById(id).exec()
    return document ? this.toDomain(document) : null
  }

  async exists(criteria: Partial<D>): Promise<boolean> {
    const count = await this.model.countDocuments(this.toFilterQuery(criteria)).exec()
    return count > 0
  }

  protected abstract toDomain(entity: T): D
}
