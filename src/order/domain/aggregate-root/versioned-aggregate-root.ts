import { AggregateRoot } from '@nestjs/cqrs';
import { Version } from './object-value/version';
import { SnapshotThreshold } from './object-value/snapshot-threshold';

const VERSION = Symbol('version');

export class VersionedAggregateRoot extends AggregateRoot {
  public id: string;

  private [VERSION] = new Version(-1);
  #snapshotThreshold = new SnapshotThreshold(5);

  get snapshotThreshold(): number {
    return this.#snapshotThreshold.value;
  }

  set snapshotThreshold(threshold: number) {
    this.#snapshotThreshold = new SnapshotThreshold(threshold);
  }

  get version(): Version {
    return this[VERSION];
  }

  private setVersion(version: Version): void {
    this[VERSION] = version;
  }
}
