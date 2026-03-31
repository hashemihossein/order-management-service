export class Amount {
  readonly value: number;

  constructor(raw: number) {
    if (typeof raw !== 'number' || isNaN(raw)) {
      throw new Error('amount must be a number');
    }
    if (raw <= 0) {
      throw new Error('amount must be positive');
    }
    this.value = raw;
  }

  toString() {
    return this.value.toString();
  }
}
