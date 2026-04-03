import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderCancelledEvent } from 'src/order/domain/events/order/order-cancelled.event';
import { OrderReadRepository } from '../ports/order-read.repository';
import { EventBrokerPort } from '../ports/event-broker.port';
import { OrderStatus } from 'src/order/domain/value-objects/order-status.vo';

@EventsHandler(OrderCancelledEvent)
export class OrderCancelledEventHandler implements IEventHandler<OrderCancelledEvent> {
  constructor(
    private readonly orderReadRepo: OrderReadRepository,
    private readonly broker: EventBrokerPort,
  ) {}

  async handle(event: OrderCancelledEvent) {
    await this.orderReadRepo.updateStatus(
      event.payload.id,
      OrderStatus.CANCELLED,
      event.payload.cancelledAt,
    );

    await this.broker.publish('order.updated', {
      orderId: event.payload.id,
      status: OrderStatus.CANCELLED,
      cancelledAt: event.payload.cancelledAt,
    });
  }
}
