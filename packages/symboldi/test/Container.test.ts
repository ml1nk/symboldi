import assert from 'node:assert/strict'
import { RefAlreadyRegistered, RefNotRegistered, Container } from 'symboldi'

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

  it('clone', async () => {
    const collection = Container.factory()
    const objRef = collection.addScoped(() => ({}))
    assert.equal(collection.get(objRef), collection.clone().get(objRef))
  })

  it('merge', async () => {
    const c1 = Container.factory()
    const c2 = Container.factory()
    const c3 = Container.factory()

    const r1 = c1.addScoped(() => ({}))
    const r2 = c1.addSingleton(() => ({}))

    c2.addSingleton(() => ({}))
    c2.addSingleton(() => ({}), r2)
    c2.addScoped(() => ({}), r1)

    c3.addScoped(() => ({}))
    c3.addSingleton(() => ({}), r1)
    c3.addScoped(() => ({}), r2)

    c2.get(r2)
    c3.get(r2)
    c2.get(r1)

    const o1 = c3.get(r1)

    c1.merge(c2, c3)

    assert.equal(c1.get(r1), o1)

    c3.scopeRenew()

    assert.notEqual(c3.get(r1), o1)
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
