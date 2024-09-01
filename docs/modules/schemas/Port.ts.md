---
title: schemas/Port.ts
nav_order: 61
parent: Modules
---

## Port overview

Operating system port schema.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Api interface](#api-interface)
  - [$Port (interface)](#port-interface)
  - [$PortBinding (interface)](#portbinding-interface)
  - [$PortMap (interface)](#portmap-interface)
  - [$PortSet (interface)](#portset-interface)
  - [$PortWithMaybeProtocol (interface)](#portwithmaybeprotocol-interface)
- [Branded constructors](#branded-constructors)
  - [PortBrand](#portbrand)
- [Branded types](#branded-types)
  - [PortBrand (type alias)](#portbrand-type-alias)
- [Schemas](#schemas)
  - [Port](#port)
  - [PortBinding](#portbinding)
  - [PortMap](#portmap)
  - [PortSet](#portset)
  - [PortWithMaybeProtocol](#portwithmaybeprotocol)

---

# Api interface

## $Port (interface)

**Signature**

```ts
export interface $Port extends Schema.Annotable<$Port, PortBrand, Brand.Brand.Unbranded<PortBrand>, never> {}
```

Added in v1.0.0

## $PortBinding (interface)

**Signature**

```ts
export interface $PortBinding
  extends Schema.Struct<{
    HostIp: Schema.optionalWith<
      typeof Schema.String,
      {
        nullable: true
      }
    >
    HostPort: typeof Schema.String
  }> {}
```

Added in v1.0.0

## $PortMap (interface)

**Signature**

```ts
export interface $PortMap extends Schema.Record$<typeof PortWithMaybeProtocol, Schema.Array$<$PortBinding>> {}
```

Added in v1.0.0

## $PortSet (interface)

**Signature**

```ts
export interface $PortSet extends Schema.Record$<$PortWithMaybeProtocol, typeof Schema.Object> {}
```

Added in v1.0.0

## $PortWithMaybeProtocol (interface)

**Signature**

```ts
export interface $PortWithMaybeProtocol
  extends Schema.Union<
    [
      Schema.TemplateLiteral<`${number}`>,
      Schema.TemplateLiteral<`${number}/tcp`>,
      Schema.TemplateLiteral<`${number}/udp`>
    ]
  > {}
```

Added in v1.0.0

# Branded constructors

## PortBrand

**Signature**

```ts
export declare const PortBrand: Brand.Brand.Constructor<PortBrand>
```

Added in v1.0.0

# Branded types

## PortBrand (type alias)

**Signature**

```ts
export type PortBrand = number & Brand.Brand<"Port">
```

Added in v1.0.0

# Schemas

## Port

An operating system port number.

**Signature**

```ts
export declare const Port: $Port
```

**Example**

```ts
import * as Schema from "@effect/schema/Schema"
import { Port } from "the-moby-effect/schemas/index.js"

const decodePort = Schema.decodeSync(Port)
assert.strictEqual(decodePort(8080), 8080)

assert.throws(() => decodePort(65536))
assert.doesNotThrow(() => decodePort(8080))
```

Added in v1.0.0

## PortBinding

A port binding between the exposed port (container) and the host.

**Signature**

```ts
export declare const PortBinding: $PortBinding
```

Added in v1.0.0

## PortMap

Port mapping between the exposed port (container) and the host.

**Signature**

```ts
export declare const PortMap: $PortMap
```

Added in v1.0.0

## PortSet

A set of operating system ports.

**Signature**

```ts
export declare const PortSet: $PortSet
```

Added in v1.0.0

## PortWithMaybeProtocol

An operating system port number with an optional protocol.

**Signature**

```ts
export declare const PortWithMaybeProtocol: $PortWithMaybeProtocol
```

Added in v1.0.0
