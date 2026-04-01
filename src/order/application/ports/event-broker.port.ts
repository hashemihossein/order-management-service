export abstract class EventBrokerPort {
  abstract publish(
    topic: string,
    payload: Record<string, unknown>,
  ): Promise<void>;
}
