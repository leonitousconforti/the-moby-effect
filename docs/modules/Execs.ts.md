---
title: Execs.ts
nav_order: 7
parent: Modules
---

## Execs overview

Execs service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [ContainerExecOptions (interface)](#containerexecoptions-interface)
  - [ExecInspectOptions (interface)](#execinspectoptions-interface)
  - [ExecResizeOptions (interface)](#execresizeoptions-interface)
  - [ExecStartOptions (interface)](#execstartoptions-interface)
  - [Execs](#execs)
  - [Execs (interface)](#execs-interface)
  - [ExecsError (class)](#execserror-class)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [layer](#layer)

---

# utils

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
  readonly execStartConfig: Schema.Schema.Type<typeof ExecStartConfig>
  /** Exec instance ID */
  readonly id: string
}
```

Added in v1.0.0

## Execs

**Signature**

```ts
export declare const Execs: Context.Tag<Execs, Execs>
```

## Execs (interface)

**Signature**

```ts
export interface Execs {
  /**
   * Create an exec instance
   *
   * @param execConfig - Exec configuration
   * @param id - ID or name of container
   */
  readonly container: (options: ContainerExecOptions) => Effect.Effect<Readonly<IdResponse>, ExecsError>

  /**
   * Start an exec instance
   *
   * @param execStartConfig -
   * @param id - Exec instance ID
   */
  readonly start: <T extends boolean | undefined>(
    options: ExecStartOptions & {
      execStartConfig: Omit<Schema.Schema.Type<typeof ExecStartConfig>, "Detach"> & { Detach?: T }
    }
  ) => Effect.Effect<T extends true ? void : MultiplexedStreamSocket | RawStreamSocket, ExecsError>

  /**
   * Resize an exec instance
   *
   * @param id - Exec instance ID
   * @param h - Height of the TTY session in characters
   * @param w - Width of the TTY session in characters
   */
  readonly resize: (options: ExecResizeOptions) => Effect.Effect<void, ExecsError>

  /**
   * Inspect an exec instance
   *
   * @param id - Exec instance ID
   */
  readonly inspect: (options: ExecInspectOptions) => Effect.Effect<ExecInspectResponse, ExecsError>
}
```

## ExecsError (class)

**Signature**

```ts
export declare class ExecsError
```

## fromAgent

**Signature**

```ts
export declare const fromAgent: (
  agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
) => Layer.Layer<Execs, never, never>
```

## fromConnectionOptions

**Signature**

```ts
export declare const fromConnectionOptions: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<Execs, never, never>
```

## layer

**Signature**

```ts
export declare const layer: Layer.Layer<Execs, never, IMobyConnectionAgent>
```
