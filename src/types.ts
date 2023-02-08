/**
 * Symbol with generic type.
 * The generic defines the data storable inside the container.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface RefSymbol<T> extends Symbol {
  /**
   * Assigned to "RefSymbol" is created by Container.
   */
  readonly description: string | undefined
}

/**
 * Needs to be implemented to create decorators.
 * Contains lookup methods from a Container by RefSymbol.
 */
export interface Lookup {
  /**
   * Retrieves the data from the container referenced by the given RefSymbol.
   * If there is no data available it returns undefined but never throws an exception.
   * @param ref - reference
   * @returns The referenced data from the container or undefined.
   */
  get: <T>(ref: RefSymbol<T>) => T | undefined
  /**
   * Retrieves the data from the container referenced by the given RefSymbol.
   * If there is no data available it throws an exception defined by the container.
   * @param ref - reference
   * @returns The referenced data from the container.
   */
  getOrFail: <T>(ref: RefSymbol<T>) => T
}
