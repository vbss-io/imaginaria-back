export interface DomainEvent<Data> {
  eventName: string
  data: Data
}
