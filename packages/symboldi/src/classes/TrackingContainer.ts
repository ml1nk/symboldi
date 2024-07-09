import { AsyncLocalStorage } from 'node:async_hooks'
import { Container } from './Container.js'
import { type RefSymbol } from './../types.js'

export class TrackingContainer extends Container {
  readonly #storage: AsyncLocalStorage<Container>

  /**
   * Container with integrated AsyncLocalStorage
   *
   * @param storage
   */
  public constructor (storage?: AsyncLocalStorage<Container>) {
    super()
    this.#storage = storage ?? new AsyncLocalStorage()
  }

  /**
   * Runs the callback in a new context.
   * If there was already a context a new scope is created,
   * otherwise the base container is cloned.
   *
   * @param callback fn to execute inside context
   * @param args args of callback
   * @returns callback result
   */
  public run<R, TArgs extends any[]>(
    callback: (...args: TArgs) => R,
    ...args: TArgs
  ): R {
    const store = this.#storage.getStore()
    const container = store !== undefined ? store.scopeCreate() : super.scopeCreate()
    return this.#storage.run(
      container,
      callback,
      ...args
    )
  }

  public storage(): AsyncLocalStorage<Container> {
    return this.#storage
  }

  public get<T>(ref: RefSymbol<T>): T | undefined {
    const store = this.#storage.getStore()
    if(store === undefined) return super.get(ref)
    else return store.get(ref)
  }

  public getOrFail<T>(ref: RefSymbol<T>): T {
    const store = this.#storage.getStore()
    if(store === undefined) return super.getOrFail(ref)
    else return store.getOrFail(ref)
  }
}
