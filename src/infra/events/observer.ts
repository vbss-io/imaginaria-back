import type { DomainEvent } from '@/domain/events/domain-event';

export class Observable {
  observers: Array<{ eventName: string; callback: (event: DomainEvent<unknown>) => Promise<void> }>

  constructor() {
    this.observers = []
  }

  register(eventName: string, callback: <Event>(event: DomainEvent<Event>) => Promise<void>): void {
    this.observers.push({ eventName, callback })
  }

  async notify<Event>(event: DomainEvent<Event>): Promise<void> {
    for (const observer of this.observers) {
      if (observer.eventName === event.eventName) {
        await observer.callback(event)
      }
    }
  }
}
