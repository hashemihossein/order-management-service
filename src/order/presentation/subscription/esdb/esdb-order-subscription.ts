import {
  Controller,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { EventBus, IEvent } from '@nestjs/cqrs';
import {
  EventStoreDBClient,
  PersistentSubscriptionToStream,
  persistentSubscriptionToStreamSettingsFromDefaults,
  START,
} from '@eventstore/db-client';
import { ESDBCoreService } from 'src/order/infrastructure/persistence/esdb/core/esdb-core.service';
import { EventDeserializer } from 'src/order/infrastructure/persistence/esdb/deserializers/event.deserializer';
import { RedisService } from 'src/order/infrastructure/in-memory/redis/redis.service';

const ORDER_SUBSCRIPTION_STREAM = '$ce-Order';
const SUBSCRIPTION_GROUP_KEY = 'order:subscription:group';

@Controller()
export class ESDBOrderSubscription
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private subscription: PersistentSubscriptionToStream;
  private consumeTask: Promise<void> | null = null;
  private readonly logger = new Logger(ESDBOrderSubscription.name);
  private readonly client: EventStoreDBClient;

  constructor(
    private readonly esdbCore: ESDBCoreService,
    private readonly deserializer: EventDeserializer,
    private readonly eventBus: EventBus,
    private readonly redis: RedisService,
  ) {
    this.client = esdbCore.getClient();
  }

  async onApplicationBootstrap() {
    const groupName = await this._getOrCreateGroupName();

    try {
      await this.client.createPersistentSubscriptionToStream(
        ORDER_SUBSCRIPTION_STREAM,
        groupName,
        persistentSubscriptionToStreamSettingsFromDefaults({
          resolveLinkTos: true,
        }),
      );
    } catch {}

    this.subscription = this.client.subscribeToPersistentSubscriptionToStream(
      ORDER_SUBSCRIPTION_STREAM,
      groupName,
    );

    this.consumeTask = this._consumeSubscription();
  }

  async onApplicationShutdown() {
    await this.subscription?.unsubscribe();
    await this.consumeTask?.catch(() => undefined);
  }

  private async _consumeSubscription(): Promise<void> {
    for await (const resolvedEvent of this.subscription) {
      try {
        if (resolvedEvent.event) {
          const deserialized = this.deserializer.deserialize(
            resolvedEvent.event,
          );
          this.eventBus.subject$.next(deserialized.data as IEvent);
          await this.subscription.ack(resolvedEvent);
        }
      } catch (err) {
        this.logger.error('Failed to process event', err);
        await this.subscription.nack(
          'skip',
          'deserialization error',
          resolvedEvent,
        );
      }
    }
  }

  private async _getOrCreateGroupName(): Promise<string> {
    const cached = await this.redis.get(SUBSCRIPTION_GROUP_KEY);
    if (cached) return cached;

    const groupName = `order-service-group-${Date.now()}`;
    await this.redis.set(SUBSCRIPTION_GROUP_KEY, groupName);
    return groupName;
  }
}
