interface Entry {
  readonly value
  readonly singleton: boolean
}

function isClassInstance(obj: any): boolean {
  return !obj.name
}

export default class Ioc {
  private static values = new Map<string, Entry>()

  public static register(name: string, value): Ioc {
    Ioc.values.set(name, { value, singleton: false })
    return Ioc
  }

  public static singleton(name: string, value): Ioc {
    Ioc.values.set(name, { value, singleton: true })
    return Ioc
  }

  public static use<T>(key: string): T {
    const entry = Ioc.values.get(key)

    if (!entry) {
      throw new Error(`Undefined key <${key}>`)
    }

    if (entry.singleton) {
      if (!isClassInstance(entry.value)) {
        const instance = new entry.value()
        Ioc.values.set(key, { value: instance, singleton: true })
        return instance
      }

      return entry.value
    }

    return new entry.value()
  }
}
