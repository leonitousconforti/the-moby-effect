---
title: endpoints/Tasks.ts
nav_order: 27
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
- [Tags](#tags)
  - [Tasks (class)](#tasks-class)

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

# Tags

## Tasks (class)

Tasks service

**Signature**

```ts
export declare class Tasks
```

Added in v1.0.0
