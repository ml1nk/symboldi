import { type Container } from './Container.js'
import { type Context } from './Context.js'
import { type Lookup, type RefSymbol } from './types.js'

export function Inject (
  container: Lookup
) {
  return <T, U>(
    ref: RefSymbol<U>
  ) => {
    return (
      target: undefined,
      context: ClassFieldDecoratorContext<T, U>
    ) => {
      return function (this: T, value: U | undefined) {
        return container.get(ref)
      }
    }
  }
}

export function InjectOrFail (
  container: Lookup
) {
  return <T, U>(
    ref: RefSymbol<U>
  ) => {
    return (
      target: undefined,
      context: ClassFieldDecoratorContext<T, U>
    ) => {
      return function (this: T, value: U) {
        return container.getOrFail(ref)
      }
    }
  }
}

export function bind (container: Context | Container): {
  Inject: ReturnType<typeof Inject>
  InjectOrFail: ReturnType<typeof InjectOrFail>
} {
  return {
    Inject: Inject(container),
    InjectOrFail: InjectOrFail(container)
  }
}