import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Type,
} from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { VersionedAggregateRoot } from 'src/order/domain/aggregate-root/versioned-aggregate-root';
import { ESDBWriteOrderRepository } from '../repositories/esdb-write-order.repository';
import { EventDeserializer } from '../deserializers/event.deserializer';
import { SerializableEvent } from 'src/order/domain/events/interfaces/serializable-event';

@Injectable()
export class AggregateRehydrator {
  constructor(
    private readonly esdbRepo: ESDBWriteOrderRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly eventDeserializer: EventDeserializer,
  ) {}

  async rehydrate<T extends VersionedAggregateRoot>(
    aggregateId: string,
    AggregateClass: Type<T>,
  ): Promise<T> {
    try {
      const streamId = `${AggregateClass.name}-${aggregateId}`;
      const stream = await this.esdbRepo.readEventsFromStream(streamId);

      const events: SerializableEvent[] = [];
      for await (const resolvedEvent of stream) {
        if (
          resolvedEvent.event.data instanceof Uint8Array ||
          resolvedEvent.event?.isJson === false
        ) {
          throw new BadRequestException('Unexpected binary event data');
        }
        events.push(this.eventDeserializer.deserialize(resolvedEvent.event));
      }

      const aggregate = new AggregateClass(aggregateId);
      this.eventPublisher.mergeObjectContext(aggregate);
      aggregate.loadFromHistory(events);

      return aggregate;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
