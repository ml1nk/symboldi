import { AsyncLocalStorage } from 'node:async_hooks'
import { Container } from './Container.js'
import { StoreMissing } from './errors/StoreMissing.js'
import { type RefSymbol, type ContainerRead } from './types.js'

export class Context implements ContainerRead {
  #storage: AsyncLocalStorage<Container>

  constructor (storage?: AsyncLocalStorage<Container>) {
    this.#storage = storage ?? new AsyncLocalStorage()
  }

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

  public getContainer (): Container | undefined {
    return this.#storage.getStore()
  }

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
    else return Container.factory()
  }
}
