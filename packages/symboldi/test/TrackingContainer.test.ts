import assert from 'node:assert/strict'
import { TrackingContainer } from '../src/classes/TrackingContainer.js'
import { AsyncLocalStorage } from 'node:async_hooks'
import { type Container } from '../src/index.js'

describe('TrackingContainer', () => {
  it('context', async () => {
    const container = new TrackingContainer()


    const ref1 = container.addSingleton(() => Symbol("test2"))
    const ref2 = container.addScoped(() => Symbol("test2"))

    const r1 = container.getOrFail(ref1)
    const r2 = container.getOrFail(ref2)

    container.run(() => {
      const ri1 = container.getOrFail(ref1)
      const ri2 = container.getOrFail(ref2)

      assert.equal(r1, ri1)
      assert.notEqual(r2, ri2)

      container.run(() => {
        const rii1 = container.getOrFail(ref1)
        const rii2 = container.getOrFail(ref2)

        assert.equal(r1, rii1)
        assert.notEqual(ri2, rii2)
      })
    })
  })

  it('storage', async () => {
    const a = new AsyncLocalStorage<Container>()
    const container = new TrackingContainer(a)
    assert.equal(a, container.storage())
  })
})
