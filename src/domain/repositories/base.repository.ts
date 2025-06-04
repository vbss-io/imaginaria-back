export interface BaseRepository<T, D> {
  find(criteria: Partial<D>): Promise<D[]>
  findOne(criteria: Partial<D>): Promise<D | null>
  create(data: Partial<T>): Promise<D>
  update(criteria: Partial<D>, data: Partial<T>): Promise<D>
  delete(criteria: Partial<D>): Promise<boolean>
  findById(id: string | number): Promise<D | null>
  exists(criteria: Partial<D>): Promise<boolean>
}
