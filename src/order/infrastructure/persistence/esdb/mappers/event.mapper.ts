import { jsonEvent, JSONEventType } from '@eventstore/db-client';
import { SerializableEvent } from 'src/order/domain/events/interfaces/serializable-event';

export class EventMapper {
  static toPersistence(events: SerializableEvent[]) {
    return events.map((e) =>
      jsonEvent({
        type: e.type,
        data: e.data,
        metadata: { position: e.position.toString() },
      }),
    );
  }
}
