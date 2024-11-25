import { RefAlreadyRegistered } from '../errors/RefAlreadyRegistered.js'
import { RefNotRegistered } from '../errors/RefNotRegistered.js'
import type { RefSymbol, ContainerFull } from '../types.js'

type ObjectFactory<T> = [(() => T), FactoryType]

const ObjectFactoryFunc = 0
const ObjectFactoryType = 1
const Zero = 0

const enum FactoryType {
  Singleton,
  Scoped,
  Transient
}

/**
 * Test
 */
export class Container implements ContainerFull<Container> {
  #factory: Map<RefSymbol<unknown>, ObjectFactory<unknown>>
  #singleton: Map<RefSymbol<unknown>, unknown>
  #scoped: Map<RefSymbol<unknown>, unknown>

  protected constructor (
    factory?: Map<RefSymbol<unknown>, ObjectFactory<unknown>>,
    singleton?: Map<RefSymbol<unknown>, unknown>,
    scoped?: Map<RefSymbol<unknown>, unknown>
  ) {
    this.#factory = factory ?? new Map<RefSymbol<unknown>, ObjectFactory<unknown>>()
    this.#singleton = singleton ?? new Map<RefSymbol<unknown>, unknown>()
    this.#scoped = scoped ?? new Map<RefSymbol<unknown>, unknown>()
  }

  /**
   * Container factory
   *
   * @returns empty Container
   */
  static factory (): Container {
    return new Container()
  }

  /**
   * Wrapper around Symbol creation to create typed referenced for direct usage in Container objects.
   * @returns typed reference
   */
  static ref<T>(): RefSymbol<T> {
    return Symbol('RefSymbol')
  }

  public merge (...args: Container[]): void {
    for (const container of args) {
      for (const [ref, fac] of container.#factory) {
        if (this.#factory.get(ref) != null) continue
        this.#factory.set(ref, fac)
      }

      for (const [ref, d] of container.#singleton) {
        const fac = this.#factory.get(ref)
        /* c8 ignore next */
        if (fac == null) continue
        if (fac[ObjectFactoryType] === FactoryType.Singleton) this.#singleton.set(ref, d)
        else if (fac[ObjectFactoryType] === FactoryType.Scoped) this.#scoped.set(ref, d)
      }

      for (const [ref, d] of container.#scoped) {
        const fac = this.#factory.get(ref)
        /* c8 ignore next */
        if (fac == null) continue
        if (fac[ObjectFactoryType] === FactoryType.Singleton) this.#singleton.set(ref, d)
        else if (fac[ObjectFactoryType] === FactoryType.Scoped) this.#scoped.set(ref, d)
      }

      container.#factory = this.#factory
      container.#singleton = this.#singleton
      container.#scoped = this.#scoped
    }
  }

  public remove<T>(ref?: RefSymbol<T>): boolean {
    if (ref === undefined) {
      const res = this.#factory.size > Zero
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
      const res = (this.#scoped.size + this.#singleton.size) > Zero
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

  public setScoped<T>(data: T, ref?: RefSymbol<T>): RefSymbol<T> {
    return this.#set(data, true, ref)
  }

  public setSingleton<T>(data: T, ref?: RefSymbol<T>): RefSymbol<T> {
    return this.#set(data, false, ref)
  }

  public addTransient<T>(factory: () => T, ref?: RefSymbol<T>): RefSymbol<T> {
    return this.#add([factory, FactoryType.Transient], ref)
  }

  public get<T>(ref: RefSymbol<T>): T | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- safe by RefSymbol
    let el = (this.#singleton.get(ref) ?? this.#scoped.get(ref)) as  T | undefined 
    if (el === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- safe by RefSymbol
      const fac = this.#factory.get(ref) as ObjectFactory<T> | undefined 
      if (fac === undefined) return undefined
      el = fac[ObjectFactoryFunc]()
      if (fac[ObjectFactoryType] === FactoryType.Singleton) this.#singleton.set(ref, el)
      else if (fac[ObjectFactoryType] === FactoryType.Scoped) this.#scoped.set(ref, el)
    }
    return el
  }

  public getOrFail<T>(ref: RefSymbol<T>): T {
    const res = this.get(ref)
    if (res === undefined) throw new RefNotRegistered()
    return res
  }

  public scopeCreate (): Container {
    return new Container(
      this.#factory,
      this.#singleton
    )
  }

  public clone (): Container {
    return new Container(
      new Map(this.#factory),
      new Map(this.#singleton),
      new Map(this.#scoped)
    )
  }

  public scopeRenew (): void {
    this.#scoped.clear()
  }

  #add<T>(factory: ObjectFactory<T>, ref?: RefSymbol<T>): RefSymbol<T> {
    ref = this.#ref(ref)
    this.#factory.set(ref, factory)
    return ref
  }

  #set<T>(data: T, scoped: boolean, ref?: RefSymbol<T>): RefSymbol<T> {
    ref = this.#ref(ref)
    if (scoped) {
      this.#scoped.set(ref, data)
    } else {
      this.#singleton.set(ref, data)
    }
    return ref
  }

  #ref<T>(ref?: RefSymbol<T>): RefSymbol<T> {
    if (ref === undefined) ref = Container.ref<T>()
    else if (this.#factory.has(ref) || this.#scoped.has(ref) || this.#singleton.has(ref)) throw new RefAlreadyRegistered()
    return ref
  }
}
