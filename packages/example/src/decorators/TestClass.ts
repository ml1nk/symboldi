import { Inject, InjectOrFail, sessionRef } from './service.js'

export class TestClass {
  @InjectOrFail(sessionRef)
    session!: string

  @Inject(sessionRef)
    sessionOptional!: string | undefined
}
