import { container, sessionRef } from './service.js'
import './register.js'

// get first session
const firstSession = container.get(sessionRef)

// renew scope
container.scopeRenew()

// get second session
const secondSession = container.get(sessionRef)

// ceff046e-ceb0-456e-875b-3010792e1294 dbe8fd2e-99c4-4f03-b57e-b930a90249f2
console.log(firstSession, secondSession)
