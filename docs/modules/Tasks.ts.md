---
title: Tasks.ts
nav_order: 21
parent: Modules
---

## Tasks overview

Tasks service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [TasksError (class)](#taskserror-class)
- [Layers](#layers)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [layer](#layer)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Tasks](#tasks)
  - [Tasks (interface)](#tasks-interface)
- [utils](#utils)
  - [TaskInspectOptions (interface)](#taskinspectoptions-interface)
  - [TaskListOptions (interface)](#tasklistoptions-interface)
  - [TaskLogsOptions (interface)](#tasklogsoptions-interface)

---

# Errors

## TasksError (class)

**Signature**

```ts
export declare class TasksError
```

Added in v1.0.0

# Layers

## fromAgent

Constructs a layer from an agent effect

**Signature**

```ts
export declare const fromAgent: (
  agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
) => Layer.Layer<Tasks, never, Scope.Scope>
```

Added in v1.0.0

## fromConnectionOptions

Constructs a layer from agent connection options

**Signature**

```ts
export declare const fromConnectionOptions: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<Tasks, never, Scope.Scope>
```

Added in v1.0.0

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Tasks, never, IMobyConnectionAgent>
```

Added in v1.0.0

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<Tasks, never, IMobyConnectionAgent | HttpClient.client.Client.Default>
```

Added in v1.0.0

# Tags

## Tasks

Tasks service

**Signature**

```ts
export declare const Tasks: Context.Tag<Tasks, Tasks>
```

Added in v1.0.0

## Tasks (interface)

**Signature**

```ts
export interface Tasks {
  /**
   * List tasks
   *
   * @param filters - A JSON encoded value of the filters (a
   *   `map[string][]string`) to process on the tasks list.
   *
   *   Available filters:
   *
   *   - `desired-state=(running | shutdown | accepted)`
   *   - `id=<task id>`
   *   - `name=<task name>`
   *   - `node=<node id or name>`
   *   - `service=<service name>`
   *   - `label=key` or `label="key=value"`
   */
  readonly list: (options?: TaskListOptions | undefined) => Effect.Effect<Readonly<Array<Task>>, TasksError>

  /**
   * Inspect a task
   *
   * @param id - ID of the task
   */
  readonly inspect: (options: TaskInspectOptions) => Effect.Effect<Readonly<Task>, TasksError>

  /**
   * Get task logs
   *
   * @param id - ID of the task
   * @param details - Show task context and extra details provided to logs.
   * @param follow - Keep connection after returning logs.
   * @param stdout - Return logs from `stdout`
   * @param stderr - Return logs from `stderr`
   * @param since - Only return logs since this time, as a UNIX timestamp
   * @param timestamps - Add timestamps to every log line
   * @param tail - Only return this number of log lines from the end of the
   *   logs. Specify as an integer or `all` to output all log lines.
   */
  readonly logs: (options: TaskLogsOptions) => Effect.Effect<Readonly<Stream.Stream<string, TasksError>>, TasksError>
}
```

Added in v1.0.0

# utils

## TaskInspectOptions (interface)

**Signature**

```ts
export interface TaskInspectOptions {
  /** ID of the task */
  readonly id: string
}
```

Added in v1.0.0

## TaskListOptions (interface)

**Signature**

```ts
export interface TaskListOptions {
  /**
   * A JSON encoded value of the filters (a `map[string][]string`) to process
   * on the tasks list.
   *
   * Available filters:
   *
   * - `desired-state=(running | shutdown | accepted)`
   * - `id=<task id>`
   * - `name=<task name>`
   * - `node=<node id or name>`
   * - `service=<service name>`
   * - `label=key` or `label="key=value"`
   */
  readonly filters?: {
    "desired-state"?: ["running" | "shutdown" | "accepted"] | undefined
    id?: [string] | undefined
    name?: [string] | undefined
    node?: [string] | undefined
    service?: [string] | undefined
    label?: Array<string> | undefined
  }
}
```

Added in v1.0.0

## TaskLogsOptions (interface)

**Signature**

```ts
export interface TaskLogsOptions {
  /** ID of the task */
  readonly id: string
  /** Show task context and extra details provided to logs. */
  readonly details?: boolean
  /** Keep connection after returning logs. */
  readonly follow?: boolean
  /** Return logs from `stdout` */
  readonly stdout?: boolean
  /** Return logs from `stderr` */
  readonly stderr?: boolean
  /** Only return logs since this time, as a UNIX timestamp */
  readonly since?: number
  /** Add timestamps to every log line */
  readonly timestamps?: boolean
  /**
   * Only return this number of log lines from the end of the logs. Specify as
   * an integer or `all` to output all log lines.
   */
  readonly tail?: string
}
```

Added in v1.0.0
