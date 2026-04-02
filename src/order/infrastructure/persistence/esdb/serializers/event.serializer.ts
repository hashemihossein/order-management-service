import { Injectable } from '@nestjs/common';
import { IEvent } from '@nestjs/cqrs';
import { VersionedAggregateRoot } from 'src/order/domain/aggregate-root/versioned-aggregate-root';
import { SerializableEvent } from 'src/order/domain/events/interfaces/serializable-event';

@Injectable()
export class EventSerializer {
  serialize(
    event: IEvent,
    aggregate: VersionedAggregateRoot,
  ): SerializableEvent {
    return {
      id: `${aggregate.constructor.name}-${aggregate.id}`,
      type: event.constructor.name,
      position: aggregate.version.value,
      data: JSON.parse(JSON.stringify(event)),
    };
  }
}
