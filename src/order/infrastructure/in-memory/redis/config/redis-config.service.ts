import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfigService {
  constructor(private readonly config: ConfigService) {}

  get host(): string {
    return this.config.get('REDIS_HOST', 'localhost');
  }
  get port(): number {
    return this.config.get<number>('REDIS_PORT', 6379);
  }
  get password(): string {
    return this.config.get('REDIS_PASSWORD', '');
  }
}
