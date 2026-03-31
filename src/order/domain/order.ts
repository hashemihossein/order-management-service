import { VersionedAggregateRoot } from './aggregate-root/versioned-aggregate-root';
import { OrderStatus } from './value-objects/order-status.vo';

export class Order extends VersionedAggregateRoot {
  constructor(
    public id: string,
    public userId?: string,
    public originToken?: string,
    public destinationToken?: string,
    public amount?: number,
    public status?: OrderStatus,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {
    super();
  }
}
