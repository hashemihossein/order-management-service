import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderCreatedEvent } from 'src/order/domain/events/order/order-created.event';
import { OrderReadRepository } from '../ports/order-read.repository';
import { EventBrokerPort } from '../ports/event-broker.port';

@EventsHandler(OrderCreatedEvent)
export class OrderCreatedEventHandler implements IEventHandler<OrderCreatedEvent> {
  constructor(
    private readonly orderReadRepo: OrderReadRepository,
    private readonly broker: EventBrokerPort,
  ) {}

  async handle(event: OrderCreatedEvent) {
    await this.orderReadRepo.upsertOrder({
      id: event.order.id,
      userId: event.order.userId,
      originToken: event.order.originToken,
      destinationToken: event.order.destinationToken,
      amount: event.order.amount,
      status: event.order.status,
      createdAt: event.order.createdAt,
      updatedAt: event.order.createdAt,
    });

    await this.broker.publish('order.created', {
      orderId: event.order.id,
      userId: event.order.userId,
      originToken: event.order.originToken,
      destinationToken: event.order.destinationToken,
      amount: event.order.amount,
      status: event.order.status,
      timestamp: event.order.createdAt,
    });
  }
}
