/**
 * Operating system port schema.
 *
 * @since 1.0.0
 */

import { Address, Port, PortWithMaybeProtocol } from "effect-schemas/Internet";
import * as Schema from "effect/Schema";

/**
 * A set of operating system ports.
 *
 * @since 1.0.0
 * @category Schemas
 * @see https://github.com/docker/go-connections/blob/5df8d2b30ca886f2d94740ce3c54abd58a5bb2c9/nat/nat.go#L23
 */
export class PortSet extends Schema.Record({
    key: PortWithMaybeProtocol.from,
    value: Schema.Object, // TODO: What is this type?
}).annotations({
    identifier: "PortSet",
    title: "A set of OS ports",
    description: "A set of operating system ports",
}) {}

/**
 * A port binding between the exposed port (container) and the host.
 *
 * @since 1.0.0
 * @category Schemas
 * @see https://github.com/docker/go-connections/blob/5df8d2b30ca886f2d94740ce3c54abd58a5bb2c9/nat/nat.go#L11-L17
 */
export class PortBinding extends Schema.Struct({
    HostPort: Schema.compose(Schema.NumberFromString, Port),
    HostIp: Schema.optional(Schema.Union(Schema.Literal(""), Address)),
}).annotations({
    identifier: "PortBinding",
    title: "nat.PortBinding",
    description: "A port binding between the exposed port (container) and the host",
}) {}

/**
 * Port mapping between the exposed port (container) and the host.
 *
 * @since 1.0.0
 * @category Schemas
 * @see https://github.com/docker/go-connections/blob/5df8d2b30ca886f2d94740ce3c54abd58a5bb2c9/nat/nat.go#L20
 */
export class PortMap extends Schema.Record({
    key: PortWithMaybeProtocol.from,
    value: Schema.Array(PortBinding),
}).annotations({
    identifier: "PortMap",
    title: "nat.PortMap",
    description: "Port mapping between the exposed port (container) and the host",
}) {}
