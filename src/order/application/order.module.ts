import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderService } from './order.service';
import { OrderFactory } from '../domain/factories/order.factory';
import { OrderCreatedEventHandler } from './event-handlers/order-created.event-handler';
import { OrderController } from '../presentation/http/order.controller';
import { PlaceOrderCommandHandler } from './commands/handler/place-order.command-handler';
import { PersistenceModule } from '../infrastructure/persistence/persistence.module';
import { MessagingModule } from '../infrastructure/messaging/messaging.module';
import { ESDBOrderSubscription } from '../presentation/subscription/esdb/esdb-order-subscription';

@Module({
  imports: [CqrsModule, PersistenceModule, MessagingModule],
  controllers: [OrderController, ESDBOrderSubscription],
  providers: [
    OrderService,
    OrderFactory,

    // Command Handlers
    PlaceOrderCommandHandler,

    // Query Handlers

    // Projection Event Handlers
    OrderCreatedEventHandler,
  ],
})
export class OrderModule {}
