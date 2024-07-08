import { Container } from '../src/classes/Container.js'
import assert from 'node:assert/strict'
import { TrackingContainer } from '../src/classes/TrackingContainer.js'

describe('TrackingContainer', () => {
  it('context', async () => {
    const context = new TrackingContainer()

    let container: Container | null = null

    context.run(() => {
      container = context.getContainer()
      const ref = container.addSingleton(() => 'test')

      context.run(() => {
        const container2 = context.getContainer()
        assert.notEqual(container, container2)
        assert.equal(container2.getOrFail(ref), 'test')
        assert.equal(context.getOrFail(ref), 'test')
      })
      assert.ok(container instanceof Container)
    })

    context.run(() => {
      const container2 = context.getContainer()
      assert.notEqual(container, container2)
      assert.ok(container instanceof Container)
    })
  })
})
