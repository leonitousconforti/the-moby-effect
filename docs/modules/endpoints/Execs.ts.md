---
title: endpoints/Execs.ts
nav_order: 14
parent: Modules
---

## Execs overview

Execs service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [ExecsError (class)](#execserror-class)
  - [ExecsErrorTypeId](#execserrortypeid)
  - [ExecsErrorTypeId (type alias)](#execserrortypeid-type-alias)
  - [isDistributionsError](#isdistributionserror)
- [Layers](#layers)
  - [layer](#layer)
- [Params](#params)
  - [ContainerExecOptions (interface)](#containerexecoptions-interface)
  - [ExecInspectOptions (interface)](#execinspectoptions-interface)
  - [ExecResizeOptions (interface)](#execresizeoptions-interface)
  - [ExecStartOptions (interface)](#execstartoptions-interface)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Execs (class)](#execs-class)
  - [ExecsImpl (interface)](#execsimpl-interface)

---

# Errors

## ExecsError (class)

**Signature**

```ts
export declare class ExecsError
```

Added in v1.0.0

## ExecsErrorTypeId

**Signature**

```ts
export declare const ExecsErrorTypeId: typeof ExecsErrorTypeId
```

Added in v1.0.0

## ExecsErrorTypeId (type alias)

**Signature**

```ts
export type ExecsErrorTypeId = typeof ExecsErrorTypeId
```

Added in v1.0.0

## isDistributionsError

**Signature**

```ts
export declare const isDistributionsError: (u: unknown) => u is ExecsError
```

Added in v1.0.0

# Layers

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Execs, never, HttpClient.HttpClient.Default>
```

Added in v1.0.0

# Params

## ContainerExecOptions (interface)

**Signature**

```ts
export interface ContainerExecOptions {
  /** Exec configuration */
  readonly execConfig: Schema.Schema.Type<typeof ExecConfig>
  /** ID or name of container */
  readonly id: string
}
```

Added in v1.0.0

## ExecInspectOptions (interface)

**Signature**

```ts
export interface ExecInspectOptions {
  /** Exec instance ID */
  readonly id: string
}
```

Added in v1.0.0

## ExecResizeOptions (interface)

**Signature**

```ts
export interface ExecResizeOptions {
  /** Exec instance ID */
  readonly id: string
  /** Height of the TTY session in characters */
  readonly h?: number
  /** Width of the TTY session in characters */
  readonly w?: number
}
```

Added in v1.0.0

## ExecStartOptions (interface)

**Signature**

```ts
export interface ExecStartOptions {
  readonly execStartConfig: Schema.Schema.Type<typeof ContainerExecStartConfig>
  /** Exec instance ID */
  readonly id: string
}
```

Added in v1.0.0

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<ExecsImpl, never, HttpClient.HttpClient.Default>
```

Added in v1.0.0

# Tags

## Execs (class)

Execs service

**Signature**

```ts
export declare class Execs
```

Added in v1.0.0

## ExecsImpl (interface)

**Signature**

```ts
export interface ExecsImpl {
  /**
   * Create an exec instance
   *
   * @param execConfig - Exec configuration
   * @param id - ID or name of container
   */
  readonly container: (options: ContainerExecOptions) => Effect.Effect<Readonly<IDResponse>, ExecsError, never>

  /**
   * Start an exec instance
   *
   * @param execStartConfig -
   * @param id - Exec instance ID
   */
  readonly start: <T extends boolean | undefined>(
    options: ExecStartOptions & {
      execStartConfig: Omit<Schema.Schema.Type<typeof ContainerExecStartConfig>, "Detach"> & { Detach?: T }
    }
  ) => T extends true
    ? Effect.Effect<void, ExecsError, never>
    : Effect.Effect<MultiplexedStreamSocket | BidirectionalRawStreamSocket, ExecsError, Scope.Scope>

  /**
   * Resize an exec instance
   *
   * @param id - Exec instance ID
   * @param h - Height of the TTY session in characters
   * @param w - Width of the TTY session in characters
   */
  readonly resize: (options: ExecResizeOptions) => Effect.Effect<void, ExecsError, never>

  /**
   * Inspect an exec instance
   *
   * @param id - Exec instance ID
   */
  readonly inspect: (options: ExecInspectOptions) => Effect.Effect<ExecInspectResponse, ExecsError, never>
}
```

Added in v1.0.0
