export class Version {
  constructor(readonly value: Number) {
    if (typeof value !== 'number') {
      throw new TypeError('Version must be a number');
    }
  }
}
