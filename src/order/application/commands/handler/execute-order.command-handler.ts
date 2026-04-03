import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ExecuteOrderCommand } from '../execute-order.command';
import { Order } from 'src/order/domain/order';
import { AggregateRehydrator } from 'src/order/infrastructure/persistence/esdb/rehydrator/aggregate.rehydrator';
import { OrderExecutedEvent } from 'src/order/domain/events/order/order-executed.event';

@CommandHandler(ExecuteOrderCommand)
export class ExecuteOrderCommandHandler implements ICommandHandler<ExecuteOrderCommand> {
  constructor(
    private readonly rehydrator: AggregateRehydrator,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ExecuteOrderCommand): Promise<Order> {
    const order = await this.rehydrator.rehydrate(command.orderId, Order);

    order.apply(
      new OrderExecutedEvent({
        id: order.id,
        executedAt: new Date().toISOString(),
      }),
    );

    this.eventPublisher.mergeObjectContext(order);
    order.commit();

    return order;
  }
}
