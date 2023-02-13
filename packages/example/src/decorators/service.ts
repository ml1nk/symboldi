import { Container } from 'symboldi'
import { bind } from 'symboldi/decorators'

// empty container
export const container = Container.factory()

// create decorators
export const { Inject, InjectOrFail } = bind(container)

// define ref for session
export const sessionRef = Container.ref<string>()
