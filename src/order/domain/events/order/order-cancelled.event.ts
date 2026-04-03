import { AutoWired } from '../autowired-event.decorator';

export interface OrderCancelledPayload {
  id: string;
  cancelledAt: string; // ISO-8601
}

@AutoWired
export class OrderCancelledEvent {
  constructor(readonly payload: OrderCancelledPayload) {}
}
