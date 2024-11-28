import { AsyncLocalStorage } from 'node:async_hooks'
import { Container } from './Container.js'
import type { RefSymbol } from './../types.js'

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
   * Inside the callback a new scope is used.
   *
   * @param callback fn to execute inside context
   * @param args args of callback
   * @returns callback result
   */
  public run<R, TArgs extends unknown[]>(
    callback: (...args: TArgs) => R,
    ...args: TArgs
  ): R {
    return this.#storage.run(
      super.scopeCreate(),
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

  public setScoped<T>(data: T, ref?: RefSymbol<T>): RefSymbol<T> {
    const store = this.#storage.getStore()
    if(store === undefined) return super.setScoped(data, ref)
    else return store.setScoped(data, ref)
  }

  public clone (): Container {
    const store = this.#storage.getStore()
    if(store === undefined) return super.clone()
    else return store.clone()
  }

  public scopeRenew (): void {
    const store = this.#storage.getStore()
    if(store === undefined) super.scopeRenew();  
    else store.scopeRenew(); 
  }

  public merge (...args: Container[]): void {
    const store = this.#storage.getStore()
    if(store === undefined) super.merge(...args);  
    else store.merge(...args); 
  }

  public getOrFail<T>(ref: RefSymbol<T>): T {
    const store = this.#storage.getStore()
    if(store === undefined) return super.getOrFail(ref)
    else return store.getOrFail(ref)
  }
}
