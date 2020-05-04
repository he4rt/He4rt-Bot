interface Entry {
  readonly value: unknown;
  readonly singleton: boolean;
}

const isConstructor = (fn: object): fn is { new (): object } =>
  "prototype" in fn;

export default class Ioc {
  private static values = new Map<string, Entry>();

  public static register(name: string, value: unknown): Ioc {
    Ioc.values.set(name, { value, singleton: false });
    return Ioc;
  }

  public static singleton(name: string, value: unknown): Ioc {
    Ioc.values.set(name, { value, singleton: true });
    return Ioc;
  }

  public static use<T extends object>(key: string): T {
    const entry = Ioc.values.get(key);

    if (!entry) {
      throw new Error(`Undefined key <${key}>`);
    }

    const value = entry.value as object;
    if (typeof entry.value !== "object") {
      throw new Error(`${value} should be an object`);
    }

    if (isConstructor(value)) {
      const Constructor = value;
      const instance = new Constructor();
      if (entry.singleton) {
        Ioc.values.set(key, { value: instance, singleton: true });
      }
      return instance as T;
    }

    return value as T;
  }
}
