import assert from 'node:assert/strict'
import { TestClass1, TestClass2, TestClass3, context, ref2 } from './helper/TestClass.js'
import { RefNotRegistered, StoreMissing } from 'symboldi'

describe('decorators', () => {
  it('context', async () => {
    const el = new TestClass1()

    assert.equal(el.test1, 'test')
    assert.equal(el.test2, undefined)
    assert.throws(() => new TestClass2(), StoreMissing)
    assert.throws(() => new TestClass3(), RefNotRegistered)

    context.run(() => {
      assert.throws(() => new TestClass2(), RefNotRegistered)
      context.getContainerOrFail().addSingleton(() => 'test2', ref2)
      const el = new TestClass1()
      assert.equal(el.test1, 'test')
      assert.equal(el.test2, 'test2')

      context.run(() => {
        const el = new TestClass1()
        assert.equal(el.test1, 'test')
        assert.equal(el.test2, 'test2')
      })
    })
  })
})
