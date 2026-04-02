import { Module } from '@nestjs/common';
import { MockKafkaService } from './mock-kafka/mock-kafka.service';
import { EventBrokerPort } from 'src/order/application/ports/event-broker.port';
import { EventBrokerAdapter } from './event-broker.adapter';

@Module({
  providers: [
    MockKafkaService,
    EventBrokerAdapter,
    { provide: EventBrokerPort, useExisting: EventBrokerAdapter },
  ],
  exports: [EventBrokerPort, MockKafkaService],
})
export class MessagingModule {}
