import { Injectable, BadRequestException } from '@nestjs/common';
import { RecordedEvent } from '@eventstore/db-client';
import { EventClassRegistry } from 'src/order/domain/events/event-class.registry';
import { SerializableEvent } from 'src/order/domain/events/interfaces/serializable-event';

@Injectable()
export class EventDeserializer {
  deserialize(recorded: RecordedEvent): SerializableEvent {
    const EventClass = EventClassRegistry.get(recorded.type);
    if (!EventClass) {
      throw new BadRequestException(
        `Unknown event type "${recorded.type}" — make sure @AutoWired is applied`,
      );
    }
    return {
      id: recorded.streamId,
      type: recorded.type,
      position: recorded.revision,
      data: Object.assign(new EventClass(), recorded.data),
    };
  }
}
