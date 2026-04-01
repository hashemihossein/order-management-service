import { AggregateRoot, IEvent } from '@nestjs/cqrs';
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

  apply<T extends IEvent>(event: T, options?: boolean | Object): void {
    if (typeof options === 'object') {
      super.apply(event, { skipHandler: true, ...options });
    } else if (typeof options === 'boolean') {
      super.apply(event, options);
    } else {
      super.apply(event, { skipHandler: true });
    }
  }
}
