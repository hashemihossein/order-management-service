export enum OrderStatus {
  PENDING = 'PENDING',
  EXECUTED = 'EXECUTED',
  CANCELLED = 'CANCELLED',
}

export class OrderStatusVO {
  constructor(readonly value: OrderStatus) {
    if (!Object.values(OrderStatus).includes(value)) {
      throw new Error(`invalid order status: ${value}`);
    }
  }

  isPending() {
    return this.value === OrderStatus.PENDING;
  }
  isExecuted() {
    return this.value === OrderStatus.EXECUTED;
  }
  isCancelled() {
    return this.value === OrderStatus.CANCELLED;
  }

  toString() {
    return this.value;
  }
}
