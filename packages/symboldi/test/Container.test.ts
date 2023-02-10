import { Container } from '../src/Container.js'
import assert from 'node:assert/strict'
import { RefNotRegistered } from '../src/errors/RefNotRegistered.js'
import { RefAlreadyRegistered } from '../src/errors/RefAlreadyRegistered.js'

describe('Container', () => {
  it('errors - ref not registered', async () => {
    const collection = Container.factory()
    const objRef = Container.ref<{ t: string }>()

    assert.equal(collection.get(objRef), undefined)
    assert.throws(() => collection.getOrFail(objRef), RefNotRegistered)
  })

  it('errors - ref already registered', async () => {
    const collection = Container.factory()
    const objRef = Container.ref<object>()

    collection.addSingleton(() => {}, objRef)
    assert.throws(() => collection.addSingleton(() => {}, objRef), RefAlreadyRegistered)
  })

  it('remove', async () => {
    const collection = Container.factory()

    const objRef1 = Container.ref<object>()
    const objRef2 = Container.ref<object>()

    collection.addSingleton(() => ({}), objRef1)
    collection.addScoped(() => ({}), objRef2)

    collection.get(objRef1)
    const b = collection.get(objRef2)

    assert.equal(collection.remove(objRef1), true)
    assert.equal(collection.remove(objRef1), false)

    assert.throws(() => collection.getOrFail(objRef1), RefNotRegistered)
    assert.equal(b, collection.getOrFail(objRef2))

    assert.equal(collection.remove(), true)
    assert.equal(collection.remove(), false)

    assert.throws(() => collection.getOrFail(objRef1), RefNotRegistered)
    assert.throws(() => collection.getOrFail(objRef2), RefNotRegistered)

    collection.addSingleton(() => ({}), objRef1)
    collection.addScoped(() => ({}), objRef2)
  })

  it('clear', async () => {
    const collection = Container.factory()
    const objRef1 = collection.addSingleton(() => ({}))
    const objRef2 = collection.addScoped(() => ({}))

    assert.equal(collection.clear(objRef1), false)
    assert.equal(collection.clear(objRef2), false)

    let a = collection.get(objRef1)
    let b = collection.get(objRef2)

    assert.equal(a, collection.get(objRef1))
    assert.equal(b, collection.get(objRef2))

    assert.equal(collection.clear(objRef1), true)
    assert.equal(collection.clear(objRef1), false)

    assert.notEqual(a, collection.get(objRef1))
    assert.equal(b, collection.get(objRef2))

    a = collection.get(objRef1)

    assert.equal(collection.clear(objRef2), true)
    assert.equal(collection.clear(objRef2), false)

    assert.equal(a, collection.get(objRef1))
    assert.notEqual(b, collection.get(objRef2))

    b = collection.get(objRef2)

    assert.equal(collection.clear(), true)
    assert.equal(collection.clear(), false)

    assert.notEqual(a, collection.get(objRef1))
    assert.notEqual(b, collection.get(objRef2))
  })

  it('singleton', async () => {
    const collection = Container.factory()
    const objRef = collection.addSingleton(() => ({}))

    assert.equal(collection.get(objRef), collection.getOrFail(objRef))
    assert.equal(collection.get(objRef), collection.scopeCreate().get(objRef))
  })

  it('singleton - session before original', async () => {
    const collection = Container.factory()
    const objRef = collection.addSingleton(() => ({}))
    assert.equal(collection.scopeCreate().get(objRef), collection.get(objRef))
  })

  it('scoped', async () => {
    const collection = Container.factory()
    const objRef = collection.addScoped(() => ({}))

    assert.equal(collection.get(objRef), collection.get(objRef))
    assert.notEqual(collection.get(objRef), collection.scopeCreate().get(objRef))

    const obj = collection.get(objRef)
    assert.equal(obj, collection.get(objRef))
    collection.scopeRenew()
    assert.notEqual(obj, collection.get(objRef))
  })

  it('transient', async () => {
    const collection = Container.factory()
    const objRef = collection.addTransient(() => ({}))

    assert.notEqual(collection.get(objRef), collection.get(objRef))
    assert.notEqual(collection.get(objRef), collection.scopeCreate().get(objRef))
  })
})
