import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CancelOrderCommand } from '../cancel-order.command';
import { Order } from 'src/order/domain/order';
import { AggregateRehydrator } from 'src/order/infrastructure/persistence/esdb/rehydrator/aggregate.rehydrator';
import { OrderCancelledEvent } from 'src/order/domain/events/order/order-cancelled.event';

@CommandHandler(CancelOrderCommand)
export class CancelOrderCommandHandler implements ICommandHandler<CancelOrderCommand> {
  constructor(
    private readonly rehydrator: AggregateRehydrator,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CancelOrderCommand): Promise<Order> {
    const order = await this.rehydrator.rehydrate(command.orderId, Order);

    order.apply(
      new OrderCancelledEvent({
        id: order.id,
        cancelledAt: new Date().toISOString(),
      }),
    );

    this.eventPublisher.mergeObjectContext(order);
    order.commit();

    return order;
  }
}
