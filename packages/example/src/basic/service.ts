import { Container } from 'symboldi'

// empty container
export const container = Container.factory()

// define ref for session
export const sessionRef = Container.ref<string>()
