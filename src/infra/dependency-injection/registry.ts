export class Registry<T extends Record<string, unknown>> {
  dependencies: T
  static instance: Registry<Record<string, unknown>>

  private constructor() {
    this.dependencies = {} as T
  }

  provide<K extends keyof T>(name: K, dependency: T[K]): void {
    this.dependencies[name] = dependency
  }

  inject<K extends keyof T>(name: K): T[K] {
    return this.dependencies[name]
  }

  static getInstance<U extends Record<string, unknown> = Record<string, unknown>>(): Registry<U> {
    if (!Registry.instance) {
      Registry.instance = new Registry<U>()
    }
    return Registry.instance as Registry<U>
  }
}

export function inject<T extends Record<string, unknown>>(name: keyof T & string) {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return function (target: object, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get() {
        return Registry.getInstance().inject(name)
      }
    })
  }
}
