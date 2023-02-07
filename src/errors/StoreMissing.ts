export class StoreMissing extends Error {
  constructor () {
    super('The store is missing, no running context?')
  }
}
