import assert from 'node:assert/strict'
import { TrackingContainer } from '../src/classes/TrackingContainer.js'
import { AsyncLocalStorage } from 'node:async_hooks'
import { Container } from '../src/index.js'

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

  it('setScoped', async () => {
    const a = new AsyncLocalStorage<Container>()
    const container = new TrackingContainer(a)

    const ref2 = container.setScoped("hi")
    assert.equal(container.get(ref2), "hi")

    container.run(() => {
      container.setScoped("hi2", ref2)
      assert.equal(container.get(ref2), "hi2")
    })

  })

  it('clone', async () => {
    const a = new AsyncLocalStorage<Container>()
    const container = new TrackingContainer(a)

    const ref2 = container.setScoped("hi")
    assert.equal(container.get(ref2), "hi")

    const cloned = container.clone()
    assert.equal(cloned.get(ref2), "hi")

    container.run(() => {
      const cloned = container.clone()
      assert.equal(cloned.get(ref2), undefined)
    })
  })

  it('scopeRenew', async () => {
    const a = new AsyncLocalStorage<Container>()
    const container = new TrackingContainer(a)

    const ref2 = container.setScoped("hi")
    assert.equal(container.get(ref2), "hi")
    container.scopeRenew()
    assert.equal(container.get(ref2), undefined)
    container.setScoped("hi",ref2)

    container.run(() => {
      container.scopeRenew()
    })
    assert.equal(container.get(ref2), "hi")
  })


  it('merge', async () => {
    const a = new AsyncLocalStorage<Container>()

    const container = new TrackingContainer(a)
    const containerb = Container.factory()
    container.merge(containerb)
    const ref = container.setScoped("hi")
    assert.equal(containerb.get(ref), "hi")

    const containerc = Container.factory()

    container.run(() => {
      const ref = container.setScoped("hi")
      assert.equal(container.get(ref), "hi")
      container.merge(containerc)
      assert.equal(containerc.get(ref), "hi")
    })
  })

})
