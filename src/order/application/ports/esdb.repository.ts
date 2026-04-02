import { SerializableEvent } from '../../domain/events/interfaces/serializable-event';

export abstract class ESDBRepository {
  abstract appendToStream(
    eventOrEvents: SerializableEvent | SerializableEvent[],
    snapshot?: SerializableEvent,
  ): Promise<boolean>;

  abstract readEventsFromStream(streamId: string): Promise<AsyncIterable<any>>;
}
