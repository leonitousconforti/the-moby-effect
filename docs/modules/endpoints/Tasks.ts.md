---
title: endpoints/Tasks.ts
nav_order: 23
parent: Modules
---

## Tasks overview

Tasks service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [TasksError (class)](#taskserror-class)
  - [isTasksError](#istaskserror)
- [Layers](#layers)
  - [TasksLayer](#taskslayer)
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

## isTasksError

**Signature**

```ts
export declare const isTasksError: (u: unknown) => u is TasksError
```

Added in v1.0.0

# Layers

## TasksLayer

**Signature**

```ts
export declare const TasksLayer: Layer.Layer<
  Tasks,
  never,
  HttpClient.HttpClient<HttpClientError.HttpClientError, Scope>
>
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
