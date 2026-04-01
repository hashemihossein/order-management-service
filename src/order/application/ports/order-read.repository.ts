import { OrderReadModel } from '../../domain/read-models/order.read-model';
import { OrderStatus } from '../../domain/value-objects/order-status.vo';

export abstract class OrderReadRepository {
  abstract upsertOrder(order: OrderReadModel): Promise<void>;
  abstract findByUserId(
    userId: string,
    status?: OrderStatus,
  ): Promise<OrderReadModel[]>;
  abstract findById(id: string): Promise<OrderReadModel | null>;
  abstract updateStatus(
    id: string,
    status: OrderStatus,
    updatedAt: string,
  ): Promise<void>;
  abstract deleteById(id: string): Promise<void>;
}
