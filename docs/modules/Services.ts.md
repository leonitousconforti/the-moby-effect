---
title: Services.ts
nav_order: 17
parent: Modules
---

## Services overview

Services service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [ServiceCreateOptions (interface)](#servicecreateoptions-interface)
  - [ServiceDeleteOptions (interface)](#servicedeleteoptions-interface)
  - [ServiceInspectOptions (interface)](#serviceinspectoptions-interface)
  - [ServiceListOptions (interface)](#servicelistoptions-interface)
  - [ServiceLogsOptions (interface)](#servicelogsoptions-interface)
  - [ServiceUpdateOptions (interface)](#serviceupdateoptions-interface)
  - [Services](#services)
  - [Services (interface)](#services-interface)
  - [ServicesError (class)](#serviceserror-class)
  - [fromAgent](#fromagent)
  - [fromConnectionOptions](#fromconnectionoptions)
  - [layer](#layer)

---

# utils

## ServiceCreateOptions (interface)

**Signature**

```ts
export interface ServiceCreateOptions {
  readonly body: ServiceSpec
  /**
   * A base64url-encoded auth configuration for pulling from private
   * registries.
   *
   * Refer to the [authentication section](#section/Authentication) for
   * details.
   */
  readonly "X-Registry-Auth"?: string
}
```

Added in v1.0.0

## ServiceDeleteOptions (interface)

**Signature**

```ts
export interface ServiceDeleteOptions {
  /** ID or name of service. */
  readonly id: string
}
```

Added in v1.0.0

## ServiceInspectOptions (interface)

**Signature**

```ts
export interface ServiceInspectOptions {
  /** ID or name of service. */
  readonly id: string
  /** Fill empty fields with default values. */
  readonly insertDefaults?: boolean
}
```

Added in v1.0.0

## ServiceListOptions (interface)

**Signature**

```ts
export interface ServiceListOptions {
  /**
   * A JSON encoded value of the filters (a `map[string][]string`) to process
   * on the services list.
   *
   * Available filters:
   *
   * - `id=<service id>`
   * - `label=<service label>`
   * - `mode=["replicated"|"global"]`
   * - `name=<service name>`
   */
  readonly filters?: string
  /** Include service status, with count of running and desired tasks. */
  readonly status?: boolean
}
```

Added in v1.0.0

## ServiceLogsOptions (interface)

**Signature**

```ts
export interface ServiceLogsOptions {
  /** ID or name of the service */
  readonly id: string
  /** Show service context and extra details provided to logs. */
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

## ServiceUpdateOptions (interface)

**Signature**

```ts
export interface ServiceUpdateOptions {
  /** ID or name of service. */
  readonly id: string
  readonly body: ServiceSpec
  /**
   * The version number of the service object being updated. This is required
   * to avoid conflicting writes. This version number should be the value as
   * currently set on the service _before_ the update. You can find the
   * current version by calling `GET /services/{id}`
   */
  readonly version: number
  /**
   * If the `X-Registry-Auth` header is not specified, this parameter
   * indicates where to find registry authorization credentials.
   */
  readonly registryAuthFrom?: string
  /**
   * Set to this parameter to `previous` to cause a server-side rollback to
   * the previous service spec. The supplied spec will be ignored in this
   * case.
   */
  readonly rollback?: string
  /**
   * A base64url-encoded auth configuration for pulling from private
   * registries.
   *
   * Refer to the [authentication section](#section/Authentication) for
   * details.
   */
  readonly "X-Registry-Auth"?: string
}
```

Added in v1.0.0

## Services

**Signature**

```ts
export declare const Services: Context.Tag<Services, Services>
```

## Services (interface)

**Signature**

```ts
export interface Services {
  /**
   * List services
   *
   * @param filters - A JSON encoded value of the filters (a
   *   `map[string][]string`) to process on the services list.
   *
   *   Available filters:
   *
   *   - `id=<service id>`
   *   - `label=<service label>`
   *   - `mode=["replicated"|"global"]`
   *   - `name=<service name>`
   *
   * @param status - Include service status, with count of running and desired
   *   tasks.
   */
  readonly list: (options?: ServiceListOptions | undefined) => Effect.Effect<Readonly<Array<Service>>, ServicesError>

  /**
   * Create a service
   *
   * @param body -
   * @param X-Registry-Auth - A base64url-encoded auth configuration for
   *   pulling from private registries.
   *
   *   Refer to the [authentication section](#section/Authentication) for
   *   details.
   */
  readonly create: (options: ServiceCreateOptions) => Effect.Effect<Readonly<ServiceCreateResponse>, ServicesError>

  /**
   * Delete a service
   *
   * @param id - ID or name of service.
   */
  readonly delete: (options: ServiceDeleteOptions) => Effect.Effect<void, ServicesError>

  /**
   * Inspect a service
   *
   * @param id - ID or name of service.
   * @param insertDefaults - Fill empty fields with default values.
   */
  readonly inspect: (options: ServiceInspectOptions) => Effect.Effect<Readonly<Service>, ServicesError>

  /**
   * Update a service
   *
   * @param id - ID or name of service.
   * @param body -
   * @param version - The version number of the service object being updated.
   *   This is required to avoid conflicting writes. This version number
   *   should be the value as currently set on the service _before_ the
   *   update. You can find the current version by calling `GET
   *   /services/{id}`
   * @param registryAuthFrom - If the `X-Registry-Auth` header is not
   *   specified, this parameter indicates where to find registry
   *   authorization credentials.
   * @param rollback - Set to this parameter to `previous` to cause a
   *   server-side rollback to the previous service spec. The supplied spec
   *   will be ignored in this case.
   * @param X-Registry-Auth - A base64url-encoded auth configuration for
   *   pulling from private registries.
   *
   *   Refer to the [authentication section](#section/Authentication) for
   *   details.
   */
  readonly update: (options: ServiceUpdateOptions) => Effect.Effect<Readonly<ServiceUpdateResponse>, ServicesError>

  /**
   * Get service logs
   *
   * @param id - ID or name of the service
   * @param details - Show service context and extra details provided to logs.
   * @param follow - Keep connection after returning logs.
   * @param stdout - Return logs from `stdout`
   * @param stderr - Return logs from `stderr`
   * @param since - Only return logs since this time, as a UNIX timestamp
   * @param timestamps - Add timestamps to every log line
   * @param tail - Only return this number of log lines from the end of the
   *   logs. Specify as an integer or `all` to output all log lines.
   */
  readonly logs: (options: ServiceLogsOptions) => Effect.Effect<Stream.Stream<string, ServicesError>, ServicesError>
}
```

Added in v1.0.0

## ServicesError (class)

**Signature**

```ts
export declare class ServicesError
```

## fromAgent

**Signature**

```ts
export declare const fromAgent: (
  agent: Effect.Effect<IMobyConnectionAgentImpl, never, Scope.Scope>
) => Layer.Layer<Services, never, never>
```

## fromConnectionOptions

**Signature**

```ts
export declare const fromConnectionOptions: (
  connectionOptions: MobyConnectionOptions
) => Layer.Layer<Services, never, never>
```

## layer

**Signature**

```ts
export declare const layer: Layer.Layer<Services, never, IMobyConnectionAgent>
```
