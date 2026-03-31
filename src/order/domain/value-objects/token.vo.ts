export class Token {
  readonly value: string;

  constructor(raw: string) {
    const normalized = raw.trim().toUpperCase();
    if (!/^[A-Z0-9]+$/.test(normalized)) {
      throw new Error(`token symbol must be alphanumeric`);
    }
    this.value = normalized;
  }

  toString() {
    return this.value;
  }
}
