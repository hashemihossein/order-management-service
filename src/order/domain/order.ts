import { VersionedAggregateRoot } from './aggregate-root/versioned-aggregate-root';
import { SerializedEventPayload } from './events/interfaces/serializable-event';
import { OrderCreatedEvent } from './events/order/order-created.event';
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
}
