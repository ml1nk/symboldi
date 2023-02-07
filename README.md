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

## Similiar projects
- [Inversify](https://github.com/inversify/InversifyJS)
- [TypeDi](https://github.com/typestack/typedi)

