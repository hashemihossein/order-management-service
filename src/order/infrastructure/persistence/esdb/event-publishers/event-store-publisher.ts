import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { EventBus, IEvent, IEventPublisher } from '@nestjs/cqrs';
import { VersionedAggregateRoot } from 'src/order/domain/aggregate-root/versioned-aggregate-root';
import { ESDBWriteOrderRepository } from '../repositories/esdb-write-order.repository';
import { EventSerializer } from '../serializers/event.serializer';
import { SerializableEvent } from 'src/order/domain/events/interfaces/serializable-event';

@Injectable()
export class EventStorePublisher
  implements OnApplicationBootstrap, IEventPublisher
{
  constructor(
    private readonly eventBus: EventBus,
    private readonly serializer: EventSerializer,
    private readonly esdbWriteRepo: ESDBWriteOrderRepository,
  ) {}

  onApplicationBootstrap() {
    this.eventBus.publisher = this;
  }

  async publish<T extends IEvent = IEvent>(
    event: T,
    dispatcher: VersionedAggregateRoot,
  ) {
    const serialized = this.serializer.serialize(event, dispatcher);
    const snapshot = this._maybeSnapshot(dispatcher, 1);

    if (snapshot)
      return this.esdbWriteRepo.appendToStream(serialized, snapshot);

    return this.esdbWriteRepo.appendToStream(serialized);
  }

  async publishAll<T extends IEvent>(
    events: T[],
    dispatcher: VersionedAggregateRoot,
  ) {
    if (!events.length) {
      throw new NotFoundException('No events to publish');
    }

    const serialized = events.map((e) =>
      this.serializer.serialize(e, dispatcher),
    );
    const snapshot = this._maybeSnapshot(dispatcher, serialized.length);

    if (snapshot)
      return this.esdbWriteRepo.appendToStream(serialized, snapshot);

    return this.esdbWriteRepo.appendToStream(serialized);
  }

  private _maybeSnapshot(
    dispatcher: VersionedAggregateRoot,
    newEventCount: number,
  ): SerializableEvent | null {
    const version = dispatcher.version.value.valueOf();
    const threshold = BigInt(dispatcher.snapshotThreshold);

    const crossesBoundary =
      version / threshold < (version + BigInt(newEventCount)) / threshold;

    if (!crossesBoundary) return null;

    const snapshotEvent = this.serializer.serialize(
      dispatcher.snapshotEvent,
      dispatcher,
    );
    snapshotEvent.position =
      snapshotEvent.position.valueOf() + BigInt(newEventCount);
    return snapshotEvent;
  }
}
