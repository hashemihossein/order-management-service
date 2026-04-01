import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Order } from 'src/order/domain/order';
import { OrderFactory } from 'src/order/domain/factories/order.factory';
import { OrderStatus } from 'src/order/domain/value-objects/order-status.vo';
import { PlaceOrderCommand } from '../place-order.command';
import { OrderCreatedEvent } from 'src/order/domain/events/order/order-created.event';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderCommandHandler implements ICommandHandler<PlaceOrderCommand> {
  constructor(
    private readonly orderFactory: OrderFactory,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: PlaceOrderCommand): Promise<Order> {
    const order = this.orderFactory.create(
      command.userId,
      command.originToken,
      command.destinationToken,
      command.amount,
    );

    order.apply(
      new OrderCreatedEvent({
        id: order.id,
        userId: order.userId,
        originToken: order.originToken,
        destinationToken: order.destinationToken,
        amount: order.amount,
        status: OrderStatus.PENDING,
        createdAt: new Date().toISOString(),
      }),
    );

    this.eventPublisher.mergeObjectContext(order);

    order.commit();

    return order;
  }
}
