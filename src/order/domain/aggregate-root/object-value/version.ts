export class Version {
  constructor(readonly value: BigInt) {
    if (typeof value !== 'bigint') {
      throw new TypeError('Version must be a BigInt');
    }
  }
}
