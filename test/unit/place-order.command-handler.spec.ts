import { EventPublisher } from '@nestjs/cqrs';
import { PlaceOrderCommandHandler } from 'src/order/application/commands/handler/place-order.command-handler';
import { PlaceOrderCommand } from 'src/order/application/commands/place-order.command';
import { OrderFactory } from 'src/order/domain/factories/order.factory';

describe('PlaceOrderCommandHandler', () => {
  let handler: PlaceOrderCommandHandler;
  let factory: jest.Mocked<OrderFactory>;
  let publisher: jest.Mocked<EventPublisher>;

  beforeEach(() => {
    factory = { create: jest.fn() } as any;
    publisher = { mergeObjectContext: jest.fn() } as any;
    handler = new PlaceOrderCommandHandler(factory, publisher);
  });

  it('should apply OrderCreatedEvent and commit', async () => {
    const mockOrder = {
      id: 'uuid-1',
      userId: 'u1',
      originToken: 'BTC',
      destinationToken: 'USDT',
      amount: 0.5,
      apply: jest.fn(),
      commit: jest.fn(),
    };
    factory.create.mockReturnValue(mockOrder as any);
    publisher.mergeObjectContext.mockReturnValue(mockOrder as any);

    const command = new PlaceOrderCommand('u1', 'BTC', 'USDT', 0.5);
    const result = await handler.execute(command);

    expect(factory.create).toHaveBeenCalledWith('u1', 'BTC', 'USDT', 0.5);
    expect(mockOrder.apply).toHaveBeenCalledTimes(1);
    expect(mockOrder.commit).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockOrder);
  });
});
