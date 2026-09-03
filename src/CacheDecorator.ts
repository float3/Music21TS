import { Base } from "./Base";

export function cacheMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    if (!(this instanceof Base)) {
      throw new Error(
        "Class must extend Cacheable to use cacheMethod decorator.",
      );
    }

    const cache = (this as Base).getCache(propertyKey);
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(
        `Returning cached result for ${propertyKey} with args: ${key}`,
      );
      return cache.get(key);
    }

    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };

  return descriptor;
}
