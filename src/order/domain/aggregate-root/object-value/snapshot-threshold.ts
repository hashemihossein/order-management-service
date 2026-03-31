export class SnapshotThreshold {
  constructor(readonly value: number) {
    if (typeof value !== 'number') {
      throw new TypeError('SnapshotThreshold must be a number');
    }
    if (value < 1) {
      throw new RangeError('SnapshotThreshold must be a positive integer');
    }
    if (Math.ceil(value) !== value) {
      throw new TypeError('SnapshotThreshold must be an integer');
    }
  }
}
