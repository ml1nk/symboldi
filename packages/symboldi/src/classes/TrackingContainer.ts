import { AsyncLocalStorage } from 'node:async_hooks'
import { Container } from './Container.js'
import { type RefSymbol, type ContainerRead } from './../types.js'

export class TrackingContainer implements ContainerRead {
  #storage: AsyncLocalStorage<Container>
  #baseContainer: Container

  /**
   * Container with integrated AsyncLocalStorage
   *
   * @param storage
   * @param baseContainer
   */
  constructor (storage?: AsyncLocalStorage<Container>, baseContainer?: Container) {
    this.#storage = storage ?? new AsyncLocalStorage()
    this.#baseContainer = baseContainer ?? Container.factory()
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
    return this.#storage.run(
      this.getContainer().scopeCreate(),
      callback,
      ...args
    )
  }

  /**
   * Get container in current context if one exists
   * @returns Container or undefined
   */
  public getContainer (): Container {
    return this.#storage.getStore() ?? this.#baseContainer
  }

  public get<T>(ref: RefSymbol<T>): T | undefined {
    return this.getContainer().get(ref)
  }

  public getOrFail<T>(ref: RefSymbol<T>): T {
    return this.getContainer().getOrFail(ref)
  }
}
