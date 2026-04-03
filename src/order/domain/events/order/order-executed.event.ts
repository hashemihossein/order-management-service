import { AutoWired } from '../autowired-event.decorator';

export interface OrderExecutedPayload {
  id: string;
  executedAt: string;
}

@AutoWired
export class OrderExecutedEvent {
  constructor(readonly payload: OrderExecutedPayload) {}
}
