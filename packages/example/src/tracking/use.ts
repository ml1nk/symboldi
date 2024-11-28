import { container, sessionRef } from './service.js'
import './register.js'

// get first session
const firstSession = container.get(sessionRef)
let secondSession = ""

container.run(()=>{
    // get a second session, inside the run callback
    secondSession = container.getOrFail(sessionRef)
})

// get a third session, outside the run callback
const thirdSession = container.getOrFail(sessionRef)

/**
 * firstSession and thirdSession matches, secondSession is different
 * ceff046e-ceb0-456e-875b-3010792e1294 dbe8fd2e-99c4-4f03-b57e-b930a90249f2 ceff046e-ceb0-456e-875b-3010792e1294
 */
console.log(firstSession, secondSession, thirdSession)
