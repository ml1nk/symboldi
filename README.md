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
import crypto from 'crypto'

// empty container
export const container = Container.factory()

// define ref for session
export const sessionRef = Container.ref<string>()
```

`register.ts`
```ts
import { sessionRef, collection } from './service.js'

collection.addScoped(() => crypto.randomUUID(), sessionRef)
```

`use.ts`
```ts
import { sessionRef, collection } from './service.js'

// get current session
const currentSession = container.get(sessionRef)

// renew scope
container.scopeRenew()

// get next session
const nextSession = container.get(sessionRef)
```


## Documentation

The documentation is build with TypeDoc and hosted on GitHub Pages at [https://ml1nk.github.io/symboldi](https://ml1nk.github.io/symboldi).


## Similiar projects
- [Inversify](https://github.com/inversify/InversifyJS)
- [TypeDi](https://github.com/typestack/typedi)

