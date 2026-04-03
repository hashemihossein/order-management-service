import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderExecutedEvent } from 'src/order/domain/events/order/order-executed.event';
import { OrderReadRepository } from '../ports/order-read.repository';
import { EventBrokerPort } from '../ports/event-broker.port';
import { OrderStatus } from 'src/order/domain/value-objects/order-status.vo';

@EventsHandler(OrderExecutedEvent)
export class OrderExecutedEventHandler implements IEventHandler<OrderExecutedEvent> {
  constructor(
    private readonly orderReadRepo: OrderReadRepository,
    private readonly broker: EventBrokerPort,
  ) {}

  async handle(event: OrderExecutedEvent) {
    await this.orderReadRepo.updateStatus(
      event.payload.id,
      OrderStatus.EXECUTED,
      event.payload.executedAt,
    );

    await this.broker.publish('order.updated', {
      orderId: event.payload.id,
      status: OrderStatus.EXECUTED,
      executedAt: event.payload.executedAt,
    });
  }
}
