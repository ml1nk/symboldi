export class RefNotRegistered extends Error {
  constructor () {
    super('Given ref is not registered')
  }
}
