import { Container } from '../src/Container.js'
import assert from 'node:assert/strict'
import { Context } from '../src/Context.js'
import { StoreMissing } from '../src/errors/StoreMissing.js'

describe('Container', () => {
  it('context', async () => {
    const context = new Context()

    assert.throws(() => context.getContainerOrFail(), StoreMissing)

    let container: Container | null = null

    context.run(() => {
      container = context.getContainerOrFail()
      const ref = container.addSingleton(() => 'test')

      context.run(() => {
        const container2 = context.getContainerOrFail()
        assert.notEqual(container, container2)
        assert.equal(container2.getOrFail(ref), 'test')
        assert.equal(context.getOrFail(ref), 'test')
      })
      assert.ok(container instanceof Container)
    })

    context.run(() => {
      const container2 = context.getContainerOrFail()
      assert.notEqual(container, container2)
      assert.ok(container instanceof Container)
    })
  })
})
