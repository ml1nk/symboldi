export class RefAlreadyRegistered extends Error {
  constructor () {
    super('Given ref is already registered')
  }
}
