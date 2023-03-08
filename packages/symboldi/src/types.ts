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
 * Subset of container methods.
 * Needs to be implemented to create decorators.
 * Contains read methods from a Container by RefSymbol.
 */
export interface ContainerRead {
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

/**
 * Container interface for full functionality.
 */
export interface ContainerFull<T extends ContainerFull<T>> extends ContainerRead {
  /**
   * Removes all or specific ref from container which includes the factory.
   *
   * @param ref - reference
   * @returns true if something was removed
   */
  remove: <T>(ref?: RefSymbol<T>) => boolean
  /**
   * Remove all or specific ref from container but leaves factory intact.
   * Only relevant for singleton or scoped services
   * @param ref - reference
   * @returns true if something was removed
   */
  clear: <T>(ref?: RefSymbol<T>) => boolean

  /**
   * Merge two or more containers.
   * Conflicting factories, service lifetimes and singletons are overwritten by priority, see args.
   *
   * @param args - container, ordered descending by priority
   */
  merge: (...args: T[]) => void

  /**
   * Add singleton factory and create matching ref.
   * If ref is given it is reused
   *
   * A singleton factory is only used once and the result cached until it is cleared.
   *
   * @param factory
   * @param ref - reference
   * @returns given or newly created reference
   */
  addSingleton: <T>(factory: () => T, ref?: RefSymbol<T>) => RefSymbol<T>

  /**
   * Add scoped factory and create matching ref.
   * If ref is given it is reused
   *
   * A scoped factory is only used once per scope.
   *
   * @param factory
   * @param ref - reference
   * @returns given or newly created reference
   */
  addScoped: <T>(factory: () => T, ref?: RefSymbol<T>) => RefSymbol<T>

  /**
   * Add transient factory and create matching ref.
   * If ref is given it is reused
   *
   * A transient factory is used for every access and the result is never cached.
   *
   * @param factory
   * @param ref - reference
   * @returns given or newly created reference
   */
  addTransient: <T>(factory: () => T, ref?: RefSymbol<T>) => RefSymbol<T>

  /**
   * Creates separate scope from the current container.
   * Data except scope is shared between copy and original object.
   *
   * @returns container
   */
  scopeCreate: () => T

  /**
   *  Renews scope of current container.
   */
  scopeRenew: () => void

  /**
   * Create a fully independent clone of the current container
   *
   * @returns container
   */
  clone: () => T
}
