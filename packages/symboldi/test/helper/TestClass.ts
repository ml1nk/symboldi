import { TrackingContainer } from 'symboldi/tracking'
import { bind } from 'symboldi/decorators'
import { Container } from 'symboldi'

const container = Container.factory()
export const ref2 = Container.ref<string>()
const ref = container.addSingleton(() => 'test')
const { Inject: Inject1, InjectOrFail: InjectOrFail1 } = bind(container)

export const context = new TrackingContainer()
const { Inject: Inject2, InjectOrFail: InjectOrFail2 } = bind(context)

export class TestClass1 {
  @Inject1(ref)
    test1!: string | undefined

  @Inject2(ref2)
    test2!: string | undefined
}

export class TestClass2 {
  @InjectOrFail2(ref2)
    test1!: string
}

export class TestClass3 {
  @InjectOrFail1(ref2)
    test1!: string
}
