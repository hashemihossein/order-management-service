import { Injectable } from '@nestjs/common';
import { EventBrokerPort } from 'src/order/application/ports/event-broker.port';
import { MockKafkaService } from './mock-kafka/mock-kafka.service';

@Injectable()
export class EventBrokerAdapter extends EventBrokerPort {
  constructor(private readonly kafka: MockKafkaService) {
    super();
  }

  async publish(
    topic: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    return this.kafka.publish(topic, payload);
  }
}
