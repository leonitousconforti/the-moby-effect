---
title: endpoints/Tasks.ts
nav_order: 25
parent: Modules
---

## Tasks overview

A task is a container running on a swarm. It is the atomic scheduling unit of
swarm. Swarm mode must be enabled for these endpoints to work.

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

A task is a container running on a swarm. It is the atomic scheduling unit of
swarm. Swarm mode must be enabled for these endpoints to work.

**Signature**

```ts
export declare const TasksLayer: Layer.Layer<Tasks, never, HttpClient.HttpClient>
```

Added in v1.0.0

# Tags

## Tasks (class)

A task is a container running on a swarm. It is the atomic scheduling unit of
swarm. Swarm mode must be enabled for these endpoints to work.

**Signature**

```ts
export declare class Tasks
```

Added in v1.0.0
