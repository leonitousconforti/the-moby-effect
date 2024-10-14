---
title: endpoints/Tasks.ts
nav_order: 25
parent: Modules
---

## Tasks overview

Tasks service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [TasksError (class)](#taskserror-class)
  - [TasksErrorTypeId](#taskserrortypeid)
  - [TasksErrorTypeId (type alias)](#taskserrortypeid-type-alias)
  - [isTasksError](#istaskserror)
- [Layers](#layers)
  - [layer](#layer)
- [Params](#params)
  - [TaskInspectOptions (interface)](#taskinspectoptions-interface)
  - [TaskListOptions (interface)](#tasklistoptions-interface)
  - [TaskLogsOptions (interface)](#tasklogsoptions-interface)
- [Tags](#tags)
  - [Tasks (class)](#tasks-class)
  - [TasksImpl (interface)](#tasksimpl-interface)

---

# Errors

## TasksError (class)

**Signature**

```ts
export declare class TasksError
```

Added in v1.0.0

## TasksErrorTypeId

**Signature**

```ts
export declare const TasksErrorTypeId: typeof TasksErrorTypeId
```

Added in v1.0.0

## TasksErrorTypeId (type alias)

**Signature**

```ts
export type TasksErrorTypeId = typeof TasksErrorTypeId
```

Added in v1.0.0

## isTasksError

**Signature**

```ts
export declare const isTasksError: (u: unknown) => u is TasksError
```

Added in v1.0.0

# Layers

## layer

**Signature**

```ts
export declare const layer: Layer.Layer<Tasks, never, HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>>
```

Added in v1.0.0

# Params

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

# Tags

## Tasks (class)

Tasks service

**Signature**

```ts
export declare class Tasks
```

Added in v1.0.0

## TasksImpl (interface)

**Signature**

```ts
export interface TasksImpl {
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
  readonly list: (options?: TaskListOptions | undefined) => Effect.Effect<Readonly<Array<SwarmTask>>, TasksError, never>

  /**
   * Inspect a task
   *
   * @param id - ID of the task
   */
  readonly inspect: (options: TaskInspectOptions) => Effect.Effect<Readonly<SwarmTask>, TasksError, never>

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
  readonly logs: (options: TaskLogsOptions) => Stream.Stream<string, TasksError, never>
}
```

Added in v1.0.0
