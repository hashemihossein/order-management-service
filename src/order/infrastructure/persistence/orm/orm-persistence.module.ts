import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrderReadRepository } from 'src/order/application/ports/order-read.repository';
import { PgReadOrderRepository } from './pg-read-order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  providers: [
    PgReadOrderRepository,
    { provide: OrderReadRepository, useExisting: PgReadOrderRepository },
  ],
  exports: [OrderReadRepository],
})
export class OrmPersistenceModule {}
