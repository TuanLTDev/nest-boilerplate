import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IEvent } from '@core/events/event.interface';

@Injectable()
export class EventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async emit(event: IEvent<Record<string, any>>) {
    return this.eventEmitter.emit(`${event.scope}.${event.name}`, event.payload);
  }

  async emitAsync(event: IEvent<Record<string, any>>) {
    return (await this.eventEmitter.emitAsync(`${event.scope}.${event.name}`, event.payload))[0] || null;
  }
}
