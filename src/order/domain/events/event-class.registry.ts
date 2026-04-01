export class EventClassRegistry {
  private static readonly registry = new Map<
    string,
    new (...args: any[]) => any
  >();

  static register(eventType: string, cls: new (...args: any[]) => any): void {
    this.registry.set(eventType, cls);
  }

  static get(eventType: string): (new (...args: any[]) => any) | undefined {
    return this.registry.get(eventType);
  }
}
