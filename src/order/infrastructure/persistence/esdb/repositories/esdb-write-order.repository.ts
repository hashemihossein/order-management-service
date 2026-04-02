import {
  AppendResult,
  EventStoreDBClient,
  ExpectedRevision,
  FORWARDS,
  ReadRevision,
  START,
} from '@eventstore/db-client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ESDBRepository } from 'src/order/application/ports/esdb.repository';
import { SerializableEvent } from 'src/order/domain/events/interfaces/serializable-event';
import { ESDBCoreService } from '../core/esdb-core.service';
import { EventMapper } from '../mappers/event.mapper';

@Injectable()
export class ESDBWriteOrderRepository extends ESDBRepository {
  private readonly client: EventStoreDBClient;

  constructor(private readonly esdbCoreService: ESDBCoreService) {
    super();
    this.client = esdbCoreService.getClient();
  }

  async appendToStream(
    eventOrEvents: SerializableEvent | SerializableEvent[],
    snapshot?: SerializableEvent,
  ): Promise<boolean> {
    const events: SerializableEvent[] = Array.isArray(eventOrEvents)
      ? eventOrEvents
      : [eventOrEvents];

    if (!events.length) {
      throw new NotFoundException('Nothing to append to stream');
    }

    const expectedRevision: ExpectedRevision =
      events[0].position === -1n
        ? 'no_stream'
        : (events[0].position.valueOf() as ExpectedRevision);

    const mappedEvents = EventMapper.toPersistence(events);

    try {
      const result: AppendResult = await this.client.appendToStream(
        events[0].id,
        mappedEvents,
        { expectedRevision },
      );

      if (snapshot) {
        const snapshotRevision: bigint =
          expectedRevision === 'no_stream'
            ? 1n
            : events[0].position.valueOf() + BigInt(events.length);

        await this._appendSnapshot(snapshot, snapshotRevision);
      }

      return result.success;
    } catch (error) {
      console.error('[ESDBWriteOrderRepository] appendToStream error:', error);
      throw error;
    }
  }

  async readEventsFromStream(streamId: string): Promise<AsyncIterable<any>> {
    const meta = await this.client.getStreamMetadata(streamId);
    let fromRevision: ReadRevision = START;

    if (meta.metadata?.lastSnapshotRevision) {
      fromRevision = BigInt(meta.metadata.lastSnapshotRevision as string);
    }

    return this.client.readStream(streamId, {
      fromRevision,
      direction: FORWARDS,
    });
  }

  private async _appendSnapshot(
    snapshot: SerializableEvent,
    expectedRevision: bigint,
  ): Promise<void> {
    try {
      const mapped = EventMapper.toPersistence([snapshot]);
      const result: AppendResult = await this.client.appendToStream(
        snapshot.id,
        mapped,
        { expectedRevision },
      );
      await this.client.setStreamMetadata(snapshot.id, {
        lastSnapshotRevision: result.nextExpectedRevision.toString(),
      });
    } catch (error) {
      console.error('[ESDBWriteOrderRepository] _appendSnapshot error:', error);
    }
  }
}
