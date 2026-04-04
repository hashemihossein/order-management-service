import { OrderFactory } from 'src/order/domain/factories/order.factory';

describe('OrderFactory', () => {
  const factory = new OrderFactory();

  it('should create an Order with valid tokens and amount', () => {
    const order = factory.create('user-1', 'BTC', 'USDT', 0.5);
    expect(order.userId).toBe('user-1');
    expect(order.originToken).toBe('BTC');
    expect(order.destinationToken).toBe('USDT');
    expect(order.amount).toBe(0.5);
    expect(order.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('should throw when originToken equals destinationToken', () => {
    expect(() => factory.create('user-1', 'BTC', 'BTC', 1)).toThrow(
      'originToken and destinationToken must be different',
    );
  });

  it('should throw when amount is negative', () => {
    expect(() => factory.create('user-1', 'BTC', 'USDT', -1)).toThrow(
      'positive',
    );
  });
});
