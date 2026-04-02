import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventStoreDBClient } from '@eventstore/db-client';

@Injectable()
export class ESDBCoreService implements OnModuleDestroy {
  private readonly client: EventStoreDBClient;

  constructor(private readonly config: ConfigService) {
    const host = config.get('ESDB_HOST', 'localhost');
    const port = config.get('ESDB_PORT', 2113);
    this.client = EventStoreDBClient.connectionString(
      `esdb://${host}:${port}?tls=false`,
    );
  }

  getClient(): EventStoreDBClient {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.dispose();
  }
}
