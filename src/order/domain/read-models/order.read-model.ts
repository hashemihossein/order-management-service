import { OrderStatus } from '../value-objects/order-status.vo';

export interface OrderReadModel {
  id: string;
  userId: string;
  originToken: string;
  destinationToken: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
