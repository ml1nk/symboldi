import { AsyncLocalStorage } from 'node:async_hooks'
import { Container } from './Container.js'
import { StoreMissing } from './../errors/StoreMissing.js'
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
      this.#contextCollection(),
      callback,
      ...args
    )
  }

  /**
   * The base container get cloned on run if there is no store available
   * @returns Container
   */
  public getBaseContainer (): Container {
    return this.#baseContainer
  }

  /**
   * Get container in current context if one exists
   * @returns Container or undefined
   */
  public getContainer (): Container | undefined {
    return this.#storage.getStore()
  }

  /**
   * Get container in current context if one exists or throw StoreMissing exception
   * @returns Container
   */
  public getContainerOrFail (): Container {
    const res = this.getContainer()
    if (res === undefined) throw new StoreMissing()
    return res
  }

  public get<T>(ref: RefSymbol<T>): T | undefined {
    return this.getContainer()?.get(ref)
  }

  public getOrFail<T>(ref: RefSymbol<T>): T {
    return this.getContainerOrFail()?.getOrFail(ref)
  }

  #contextCollection (): Container {
    const obj = this.#storage.getStore()
    if (obj !== undefined) return obj.scopeCreate()
    else return this.#baseContainer.clone()
  }
}
