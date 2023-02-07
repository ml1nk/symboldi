import { RefAlreadyRegistered } from './errors/RefAlreadyRegistered.js'
import { RefNotRegistered } from './errors/RefNotRegistered.js'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface RefSymbol<T> extends Symbol {

}

type ObjectFactory<T> = [(() => T), FactoryType]

const enum FactoryType {
  Singleton,
  Scoped,
  Transient
}

/**
 * Test
 */
export class Container {
  #factory: Map<RefSymbol<unknown>, ObjectFactory<any>>
  #singleton: Map<RefSymbol<unknown>, any>
  #scoped = new Map<RefSymbol<unknown>, any>()

  private constructor (
    factory?: Map<RefSymbol<unknown>, ObjectFactory<any>>,
    singleton?: Map<RefSymbol<unknown>, any>
  ) {
    this.#factory = factory ?? new Map()
    this.#singleton = singleton ?? new Map()
  }

  static factory (): Container {
    return new Container()
  }

  static ref<T>(): RefSymbol<T> {
    return Symbol('ref')
  }

  public remove<T>(ref?: RefSymbol<T>): boolean {
    if (ref === undefined) {
      const res = this.#factory.size > 0
      this.#factory.clear()
      this.#scoped.clear()
      this.#singleton.clear()
      return res
    } else {
      this.#singleton.delete(ref) || this.#scoped.delete(ref)
      return this.#factory.delete(ref)
    }
  }

  public clear<T>(ref?: RefSymbol<T>): boolean {
    if (ref === undefined) {
      const res = (this.#scoped.size + this.#singleton.size) > 0
      this.#scoped.clear()
      this.#singleton.clear()
      return res
    } else {
      return this.#singleton.delete(ref) || this.#scoped.delete(ref)
    }
  }

  public addSingleton<T>(factory: () => T, ref?: RefSymbol<T>): RefSymbol<T> {
    return this.#add([factory, FactoryType.Singleton], ref)
  }

  public addScoped<T>(factory: () => T, ref?: RefSymbol<T>): RefSymbol<T> {
    return this.#add([factory, FactoryType.Scoped], ref)
  }

  public addTransient<T>(factory: () => T, ref?: RefSymbol<T>): RefSymbol<T> {
    return this.#add([factory, FactoryType.Transient], ref)
  }

  public get<T>(ref: RefSymbol<T>): T | undefined {
    let el: T | undefined = this.#singleton.get(ref) ?? this.#scoped.get(ref)
    if (el === undefined) {
      const fac: ObjectFactory<T> | undefined = this.#factory.get(ref)
      if (fac === undefined) return undefined
      el = fac[0]()
      if (fac[1] === FactoryType.Singleton) this.#singleton.set(ref, el)
      else if (fac[1] === FactoryType.Scoped) this.#scoped.set(ref, el)
    }
    return el
  }

  public getOrFail<T>(ref: RefSymbol<T>): T {
    const res = this.get(ref)
    if (res === undefined) throw new RefNotRegistered()
    return res
  }

  public createSession (): Container {
    return new Container(
      this.#factory,
      this.#singleton
    )
  }

  #add<T>(factory: ObjectFactory<T>, ref?: RefSymbol<T>): RefSymbol<T> {
    ref = this.#ref(ref)
    this.#factory.set(ref, factory)
    return ref
  }

  #ref<T>(ref?: RefSymbol<T>): RefSymbol<T> {
    if (ref === undefined) ref = Container.ref<T>()
    else if (this.#factory.has(ref)) throw new RefAlreadyRegistered()
    return ref
  }
}
