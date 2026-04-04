import { Order } from 'src/order/domain/order';
import { OrderStatus } from 'src/order/domain/value-objects/order-status.vo';
import { OrderCreatedEvent } from 'src/order/domain/events/order/order-created.event';
import { OrderExecutedEvent } from 'src/order/domain/events/order/order-executed.event';
import { OrderCancelledEvent } from 'src/order/domain/events/order/order-cancelled.event';

describe('Order Aggregate', () => {
  const createdPayload = {
    id: 'ord-1',
    userId: 'usr-1',
    originToken: 'BTC',
    destinationToken: 'USDT',
    amount: 1.0,
    status: OrderStatus.PENDING,
    createdAt: new Date().toISOString(),
  };

  it('should set state on OrderCreatedEvent', () => {
    const order = new Order(
      createdPayload.id,
      createdPayload.userId,
      createdPayload.originToken,
      createdPayload.destinationToken,
      createdPayload.amount,
      createdPayload.status,
      new Date(createdPayload.createdAt),
    );
    (order as any)[`on${OrderCreatedEvent.name}`]({ order: createdPayload });
    expect(order.status).toBe(OrderStatus.PENDING);
    expect(order.originToken).toBe('BTC');
  });

  it('should transition to EXECUTED on OrderExecutedEvent when PENDING', () => {
    const order = new Order(
      createdPayload.id,
      createdPayload.userId,
      createdPayload.originToken,
      createdPayload.destinationToken,
      createdPayload.amount,
      createdPayload.status,
      new Date(createdPayload.createdAt),
    );
    (order as any)[`on${OrderCreatedEvent.name}`]({ order: createdPayload });
    (order as any)[`on${OrderExecutedEvent.name}`]({
      payload: { id: 'ord-1', executedAt: new Date().toISOString() },
    });
    expect(order.status).toBe(OrderStatus.EXECUTED);
  });

  it('should throw BadRequestException when cancelling a non-PENDING order', () => {
    const order = new Order(
      createdPayload.id,
      createdPayload.userId,
      createdPayload.originToken,
      createdPayload.destinationToken,
      createdPayload.amount,
      createdPayload.status,
      new Date(createdPayload.createdAt),
    );
    (order as any)[`on${OrderCreatedEvent.name}`]({ order: createdPayload });
    (order as any)[`on${OrderExecutedEvent.name}`]({
      payload: { id: 'ord-1', executedAt: new Date().toISOString() },
    });
    expect(() => {
      (order as any)[`on${OrderCancelledEvent.name}`]({
        payload: { id: 'ord-1', cancelledAt: new Date().toISOString() },
      });
    }).toThrow('cannot be cancelled');
  });
});
