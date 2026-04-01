import { EventClassRegistry } from './event-class.registry';

export function AutoWired<T extends new (...args: any[]) => any>(
  constructor: T,
): T {
  EventClassRegistry.register(constructor.name, constructor);
  return constructor;
}
