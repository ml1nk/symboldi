import { container } from './service.js'
import './register.js'
import { TestClass } from './TestClass.js'

// get test object
const firstTestObject = new TestClass()

// renew scope
container.scopeRenew()

// get second test object
const secondTestObject = new TestClass()

// ceff046e-ceb0-456e-875b-3010792e1294 dbe8fd2e-99c4-4f03-b57e-b930a90249f2
console.log(firstTestObject.session, secondTestObject.session)
