// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface RefSymbol<T> extends Symbol {

}

export interface Lookup {
  get: <T>(ref: RefSymbol<T>) => T | undefined
  getOrFail: <T>(ref: RefSymbol<T>) => T
}
