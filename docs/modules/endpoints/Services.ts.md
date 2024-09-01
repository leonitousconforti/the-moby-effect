---
title: endpoints/Services.ts
nav_order: 29
parent: Modules
---

## Services overview

Services service

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Errors](#errors)
  - [ServicesError (class)](#serviceserror-class)
  - [ServicesErrorTypeId](#serviceserrortypeid)
  - [ServicesErrorTypeId (type alias)](#serviceserrortypeid-type-alias)
  - [isServicesError](#isserviceserror)
- [Layers](#layers)
  - [layer](#layer)
- [Params](#params)
  - [ServiceCreateOptions (interface)](#servicecreateoptions-interface)
  - [ServiceDeleteOptions (interface)](#servicedeleteoptions-interface)
  - [ServiceInspectOptions (interface)](#serviceinspectoptions-interface)
  - [ServiceListOptions (interface)](#servicelistoptions-interface)
  - [ServiceLogsOptions (interface)](#servicelogsoptions-interface)
  - [ServiceUpdateOptions (interface)](#serviceupdateoptions-interface)
- [Services](#services)
  - [make](#make)
- [Tags](#tags)
  - [Services (class)](#services-class)
  - [ServicesImpl (interface)](#servicesimpl-interface)

---

# Errors

## ServicesError (class)

**Signature**

```ts
export declare class ServicesError
```

Added in v1.0.0

## ServicesErrorTypeId

**Signature**

```ts
export declare const ServicesErrorTypeId: typeof ServicesErrorTypeId
```

Added in v1.0.0

## ServicesErrorTypeId (type alias)

**Signature**

```ts
export type ServicesErrorTypeId = typeof ServicesErrorTypeId
```

Added in v1.0.0

## isServicesError

**Signature**

```ts
export declare const isServicesError: (u: unknown) => u is ServicesError
```

Added in v1.0.0

# Layers

## layer

Configs layer that depends on the MobyConnectionAgent

**Signature**

```ts
export declare const layer: Layer.Layer<Services, never, HttpClient.HttpClient.Default>
```

Added in v1.0.0

# Params

## ServiceCreateOptions (interface)

**Signature**

```ts
export interface ServiceCreateOptions {
  readonly body: SwarmServiceSpec
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
   *
   * FIXME: implement this type
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
  readonly body: SwarmServiceSpec
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

# Services

## make

**Signature**

```ts
export declare const make: Effect.Effect<ServicesImpl, never, HttpClient.HttpClient.Default>
```

Added in v1.0.0

# Tags

## Services (class)

Services service

**Signature**

```ts
export declare class Services
```

Added in v1.0.0

## ServicesImpl (interface)

**Signature**

```ts
export interface ServicesImpl {
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
  readonly list: (
    options?: ServiceListOptions | undefined
  ) => Effect.Effect<Readonly<Array<SwarmService>>, ServicesError, never>

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
  readonly create: (
    options: ServiceCreateOptions
  ) => Effect.Effect<Readonly<SwarmServiceCreateResponse>, ServicesError, never>

  /**
   * Delete a service
   *
   * @param id - ID or name of service.
   */
  readonly delete: (options: ServiceDeleteOptions) => Effect.Effect<void, ServicesError, never>

  /**
   * Inspect a service
   *
   * @param id - ID or name of service.
   * @param insertDefaults - Fill empty fields with default values.
   */
  readonly inspect: (options: ServiceInspectOptions) => Effect.Effect<Readonly<SwarmService>, ServicesError, never>

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
  readonly update: (
    options: ServiceUpdateOptions
  ) => Effect.Effect<Readonly<SwarmServiceUpdateResponse>, ServicesError, never>

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
  readonly logs: (options: ServiceLogsOptions) => Stream.Stream<string, ServicesError, never>
}
```

Added in v1.0.0
