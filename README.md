# SymbolDI

[![NPM Version](https://img.shields.io/npm/v/symboldi.svg)](https://www.npmjs.com/package/symboldi)
[![Downloads](https://img.shields.io/npm/dm/symboldi.svg)](https://www.npmjs.com/package/symboldi)
[![Build & Test](https://github.com/ml1nk/symboldi/actions/workflows/publish.yml/badge.svg)](https://github.com/ml1nk/symboldi/actions/workflows/publish.yml)

SymbolDI is a tool to use dependency injection with service lifetime. It is dependency free and in particular doesn't need reflect-metadata to work. Instead it creates typed symbols which can be used to retrieve the data. As such it isn't limited to classes but can also be used with primitives, arrays and plain objects.

> Inspired by [Dependency injection in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection) and the new-found possibilities of AsyncLocalStorage.


## Installation
~~~ts
npm install symboldi
~~~

If you want to use decorators make sure you have TypeScript 5 or higher installed and [experimentalDecorators](https://www.typescriptlang.org/tsconfig#experimentalDecorators) disabled, which is the default.

## Basic Usage

* create a container
* create some refs
* register some services by ref and factory
* get typed object by container with ref

`service.ts`
```ts
import { Container } from 'symboldi';

// empty container
export const container = Container.factory()

// define ref for session
export const sessionRef = Container.ref<string>()
```

`register.ts`
```ts
import { sessionRef, container } from './service.js'
import crypto from 'crypto'

container.addScoped(() => crypto.randomUUID(), sessionRef)
```

`use.ts`
```ts
import { sessionRef, container } from './service.js'
import './register.js'

// get current session
const currentSession = container.get(sessionRef)

// renew scope
container.scopeRenew()

// get next session
const nextSession = container.get(sessionRef)

// ceff046e-ceb0-456e-875b-3010792e1294 dbe8fd2e-99c4-4f03-b57e-b930a90249f2
console.log(currentSession, nextSession)
```

## Extensions

 - The TrackingContainer in comparison to a normal Container has the method `run` which wraps around AsyncLocalStorage. Inside the callback of `run` the methods of TrackingContainer are using a separate scope.

 - The decorators `Inject` and `InjectOrFail` can be created for a container and then used above class variables. When an object of such a class is created, the decorated class variables are filled by the container.

## Integrations

Some libraries include direct support or are easily extended with a  context object. Typically AsynLocalStorage is used in the background to track it. The TrackingContainer also uses asynchronous context tracking and creates a new scope inside every `run` callback.

For example every http request could be tracked and enriched by user authentication information, trace id, log level and an own entity manager fork or database cache.

### [MikroORM](https://github.com/mikro-orm/mikro-orm)

Create a TrackingContainer and ContainerRef based on EntityManager of MikroORM somewhere easily reachable within your codebase.

~~~ts
import type { EntityManager } from '@mikro-orm/core'
import { Container } from 'symboldi'
import { TrackingContainer } from 'symboldi/tracking'

export const container = new TrackingContainer()
export const ormRef = Container.ref<EntityManager>()
~~~

Add a scoped factory to create a fork of EntityManager. It is necessary to use the option `disableContextResolution` to prevent a recursion. Now init MikroORM with the `context` option getting the orm object from the container.

~~~ts
let orm: EntityManager | null  = null

container.addScoped(() => {
  if (orm === null)
    return null
  return orm.em.fork({ disableContextResolution: true })
}, ormRef)

orm = await MikroORM.init({
    context: () => container.get(ormRef),
    ...
})
~~~

You don't need to export orm, as `container.get(ormRef)` makes it available. As it is only called once per scope if sued, it doesn't have any impact on scopes without database usage. 


## Documentation

The documentation is build with TypeDoc and hosted on GitHub Pages at [https://ml1nk.github.io/symboldi](https://ml1nk.github.io/symboldi).

### Examples

- [Basic](https://github.com/ml1nk/symboldi/tree/main/packages/example/src/basic)

- [Tracking](https://github.com/ml1nk/symboldi/tree/main/packages/example/src/tracking)

- [Decorators](https://github.com/ml1nk/symboldi/tree/main/packages/example/src/decorators)

## Similiar projects

- [Inversify](https://github.com/inversify/InversifyJS)
  
- [TypeDi](https://github.com/typestack/typedi)

