import { Module } from '@nestjs/common';
import { OrmPersistenceModule } from './orm/orm-persistence.module';
import { ESDBModule } from './esdb/esdb.module';

@Module({
  imports: [ESDBModule, OrmPersistenceModule],
  exports: [ESDBModule, OrmPersistenceModule],
})
export class PersistenceModule {}
