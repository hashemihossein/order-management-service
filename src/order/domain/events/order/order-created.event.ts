import { AutoWired } from '../autowired-event.decorator';
import { OrderStatus } from '../../value-objects/order-status.vo';

export interface OrderCreatedPayload {
  id: string;
  userId: string;
  originToken: string;
  destinationToken: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
}

@AutoWired
export class OrderCreatedEvent {
  constructor(readonly order: OrderCreatedPayload) {}
}
