import { type ContainerRead, type RefSymbol } from './types.js'

export function Inject (
  container: ContainerRead
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
  container: ContainerRead
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

export function bind (container: ContainerRead): {
  Inject: ReturnType<typeof Inject>
  InjectOrFail: ReturnType<typeof InjectOrFail>
} {
  return {
    Inject: Inject(container),
    InjectOrFail: InjectOrFail(container)
  }
}
