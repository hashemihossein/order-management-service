import { AutoWired } from './autowired-event.decorator';

@AutoWired
export class AggregateSnapshotEvent {
  constructor(readonly aggregate: object) {}
}
