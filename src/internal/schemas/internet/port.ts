/**
 * Operating system port schema.
 *
 * @since 1.0.0
 */

import * as Function from "effect/Function";
import * as Schema from "effect/Schema";
import { Address } from "./address.js";

/**
 * An operating system port number.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     import * as Schema from "effect/Schema";
 *     import { Port } from "the-moby-effect/schemas/index.js";
 *
 *     const decodePort = Schema.decodeSync(Port);
 *     assert.strictEqual(decodePort(8080), 8080);
 *
 *     assert.throws(() => decodePort(65536));
 *     assert.doesNotThrow(() => decodePort(8080));
 */
export class Port extends Function.pipe(
    Schema.Int,
    Schema.between(0, 2 ** 16 - 1),
    Schema.brand("Port"),
    Schema.annotations({
        identifier: "Port",
        title: "An OS port number",
        description: "An operating system's port number between 0 and 65535 (inclusive)",
    })
) {}

/**
 * An operating system port number with an optional protocol.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class PortWithMaybeProtocol extends Schema.Union(
    Schema.TemplateLiteral(Schema.Number),
    Schema.TemplateLiteral(Schema.Number, "/", Schema.Literal("tcp")),
    Schema.TemplateLiteral(Schema.Number, "/", Schema.Literal("udp"))
).annotations({
    identifier: "PortWithMaybeProtocol",
    title: "An OS port number with an optional protocol",
    description: "An operating system's port number with an optional protocol",
}) {}

/**
 * A set of operating system ports.
 *
 * @since 1.0.0
 * @category Schemas
 * @see https://github.com/docker/go-connections/blob/5df8d2b30ca886f2d94740ce3c54abd58a5bb2c9/nat/nat.go#L23
 */
export class PortSet extends Schema.Record({
    key: PortWithMaybeProtocol,
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
    key: PortWithMaybeProtocol,
    value: Schema.Array(PortBinding),
}).annotations({
    identifier: "PortMap",
    title: "nat.PortMap",
    description: "Port mapping between the exposed port (container) and the host",
}) {}
