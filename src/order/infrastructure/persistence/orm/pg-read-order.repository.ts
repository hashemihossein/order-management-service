import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderReadRepository } from 'src/order/application/ports/order-read.repository';
import { OrderReadModel } from 'src/order/domain/read-models/order.read-model';
import { OrderStatus } from 'src/order/domain/value-objects/order-status.vo';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class PgReadOrderRepository extends OrderReadRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repo: Repository<OrderEntity>,
  ) {
    super();
  }

  async upsertOrder(model: OrderReadModel): Promise<void> {
    await this.repo.upsert(
      {
        id: model.id,
        userId: model.userId,
        originToken: model.originToken,
        destinationToken: model.destinationToken,
        amount: model.amount,
        status: model.status,
        createdAt: new Date(model.createdAt),
        updatedAt: new Date(model.updatedAt),
      },
      ['id'],
    );
  }

  async findByUserId(
    userId: string,
    status?: OrderStatus,
  ): Promise<OrderReadModel[]> {
    const where: { userId: string; status?: OrderStatus } = { userId };
    if (status) where.status = status;
    const entities = await this.repo.find({
      where,
      order: { createdAt: 'DESC' },
    });
    return entities.map(this._toReadModel);
  }

  async findById(id: string): Promise<OrderReadModel | null> {
    const entity = await this.repo.findOneBy({ id });
    return entity ? this._toReadModel(entity) : null;
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    updatedAt: string,
  ): Promise<void> {
    await this.repo.update(id, { status, updatedAt: new Date(updatedAt) });
  }

  async deleteById(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private _toReadModel(e: OrderEntity): OrderReadModel {
    return {
      id: e.id,
      userId: e.userId,
      originToken: e.originToken,
      destinationToken: e.destinationToken,
      amount: Number(e.amount),
      status: e.status,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    };
  }
}
