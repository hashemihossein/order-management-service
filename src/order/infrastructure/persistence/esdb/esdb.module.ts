import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ESDBCoreModule } from './core/esdb-core.module';
import { ESDBWriteOrderRepository } from './repositories/esdb-write-order.repository';
import { EventSerializer } from './serializers/event.serializer';
import { EventMapper } from './mappers/event.mapper';
import { AggregateRehydrator } from './rehydrator/aggregate.rehydrator';
import { EventStorePublisher } from './event-publishers/event-store-publisher';
import { ESDBRepository } from 'src/order/application/ports/esdb.repository';
import { EventDeserializer } from './deserializers/event.deserializer';

@Module({
  imports: [ESDBCoreModule, CqrsModule],
  providers: [
    ESDBWriteOrderRepository,
    EventSerializer,
    EventDeserializer,
    EventMapper,
    AggregateRehydrator,
    EventStorePublisher,
    { provide: ESDBRepository, useExisting: ESDBWriteOrderRepository },
  ],
  exports: [
    ESDBCoreModule,
    ESDBRepository,
    ESDBWriteOrderRepository,
    AggregateRehydrator,
    EventStorePublisher,
    EventDeserializer,
  ],
})
export class ESDBModule {}
