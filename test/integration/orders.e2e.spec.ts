import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Orders (e2e)', () => {
  let app: INestApplication;
  let createdOrderId: string;

  const waitForOrderByUser = async (userId: string, orderId: string) => {
    for (let attempt = 0; attempt < 20; attempt++) {
      const res = await request(app.getHttpServer())
        .get(`/orders?userId=${userId}`)
        .expect(200);

      const found = res.body.find((o: any) => o.id === orderId);
      if (found) return found;

      await sleep(100);
    }

    throw new Error(`Order ${orderId} was not projected in time`);
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await sleep(300);
    await app.close();
  });

  it('POST /orders — should create a PENDING order', async () => {
    const res = await request(app.getHttpServer())
      .post('/orders')
      .send({
        userId: 'user-e2e',
        originToken: 'BTC',
        destinationToken: 'USDT',
        amount: 0.1,
      })
      .expect(201);

    createdOrderId = res.body.id;
    expect(createdOrderId).toBeDefined();
    expect(res.body.originToken).toBe('BTC');
  });

  it('GET /orders?userId=user-e2e — should return the created order', async () => {
    const order = await waitForOrderByUser('user-e2e', createdOrderId);
    expect(order.id).toBe(createdOrderId);
  });

  it('PATCH /orders/:id/execute — should process execute command', async () => {
    await request(app.getHttpServer())
      .patch(`/orders/${createdOrderId}/execute`)
      .expect(200);
  });

  it('PATCH /orders/:id/cancel — should return a valid command response', async () => {
    await request(app.getHttpServer())
      .patch(`/orders/${createdOrderId}/cancel`)
      .expect((res) => {
        expect([200, 400]).toContain(res.status);
      });
  });
});
