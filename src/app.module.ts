import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { OrderModule } from './order/application/order.module';
import { OrderEntity } from './order/infrastructure/persistence/orm/entities/order.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        synchronize: config.get('TYPEORM_SYNCHRONIZE') === 'true',
        type: 'postgres',
        host: config.get('PG_HOST', 'localhost'),
        port: config.getOrThrow<number>('PG_PORT'),
        username: config.getOrThrow('PG_USER'),
        password: config.getOrThrow('PG_PASSWORD'),
        database: config.getOrThrow('PG_DB'),
        entities: [OrderEntity],
      }),
    }),
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
