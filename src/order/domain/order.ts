import { BadRequestException } from '@nestjs/common';
import { VersionedAggregateRoot } from './aggregate-root/versioned-aggregate-root';
import { SerializedEventPayload } from './events/interfaces/serializable-event';
import { OrderCreatedEvent } from './events/order/order-created.event';
import { OrderExecutedEvent } from './events/order/order-executed.event';
import { OrderStatus } from './value-objects/order-status.vo';

export class Order extends VersionedAggregateRoot {
  constructor(
    public id: string,
    public userId: string,
    public originToken: string,
    public destinationToken: string,
    public amount: number,
    public status?: OrderStatus,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {
    super();
  }

  [`on${OrderCreatedEvent.name}`](
    event: SerializedEventPayload<OrderCreatedEvent>,
  ) {
    this.userId = event.order.userId;
    this.originToken = event.order.originToken;
    this.destinationToken = event.order.destinationToken;
    this.amount = event.order.amount;
    this.status = event.order.status;
    this.createdAt = new Date(event.order.createdAt);
    this.updatedAt = new Date(event.order.createdAt);
  }

  [`on${OrderExecutedEvent.name}`](
    event: SerializedEventPayload<OrderExecutedEvent>,
  ) {
    if (this.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Order ${this.id} cannot be executed; current status: ${this.status}`,
      );
    }
    this.status = OrderStatus.EXECUTED;
    this.updatedAt = new Date(event.payload.executedAt);
  }
}
