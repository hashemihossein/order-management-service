import { Module } from '@nestjs/common';
import { ESDBCoreService } from './esdb-core.service';
import { RedisModule } from 'src/order/infrastructure/in-memory/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [ESDBCoreService],
  exports: [ESDBCoreService, RedisModule],
})
export class ESDBCoreModule {}
