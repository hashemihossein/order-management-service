import { Injectable, Logger } from '@nestjs/common';

export interface KafkaMessage {
  topic: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

@Injectable()
export class MockKafkaService {
  private readonly logger = new Logger(MockKafkaService.name);
  private readonly messages: KafkaMessage[] = [];

  async publish(
    topic: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    const message: KafkaMessage = {
      topic,
      payload,
      timestamp: new Date().toISOString(),
    };
    this.messages.push(message);
    this.logger.log(
      `[MockKafka] → topic: "${topic}" | payload: ${JSON.stringify(payload)}`,
    );
  }

  getMessages(topic?: string): KafkaMessage[] {
    return topic
      ? this.messages.filter((m) => m.topic === topic)
      : [...this.messages];
  }

  clearMessages(): void {
    this.messages.length = 0;
  }
}
