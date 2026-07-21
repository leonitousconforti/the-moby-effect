/**
 * Operating system port schema.
 *
 * @since 1.0.0
 */

import * as Schema from "effect/Schema";

import { Address, Port, PortWithMaybeProtocol } from "effect-schemas/Internet";

/**
 * A set of operating system ports.
 *
 * @since 1.0.0
 * @category Schemas
 * @see https://github.com/docker/go-connections/blob/5df8d2b30ca886f2d94740ce3c54abd58a5bb2c9/nat/nat.go#L23
 */
export const PortSet = Schema.Record(PortWithMaybeProtocol.from, Schema.ObjectKeyword).annotate({
    identifier: "PortSet",
    title: "A set of OS ports",
    description: "A set of operating system ports",
});

/**
 * A port binding between the exposed port (container) and the host.
 *
 * @since 1.0.0
 * @category Schemas
 * @see https://github.com/docker/go-connections/blob/5df8d2b30ca886f2d94740ce3c54abd58a5bb2c9/nat/nat.go#L11-L17
 */
export class PortBinding extends Schema.Class<PortBinding>("PortBinding")(
    {
        HostPort: Schema.NumberFromString.pipe(Schema.decodeTo(Port)),
        HostIp: Schema.optional(Schema.Union([Schema.Literal(""), Address])),
    },
    {
        identifier: "PortBinding",
        title: "nat.PortBinding",
        description: "A port binding between the exposed port (container) and the host",
    }
) {}

/**
 * Port mapping between the exposed port (container) and the host.
 *
 * @since 1.0.0
 * @category Schemas
 * @see https://github.com/docker/go-connections/blob/5df8d2b30ca886f2d94740ce3c54abd58a5bb2c9/nat/nat.go#L20
 */
export const PortMap = Schema.Record(PortWithMaybeProtocol.from, Schema.NullOr(Schema.Array(PortBinding))).annotate({
    identifier: "PortMap",
    title: "nat.PortMap",
    description: "Port mapping between the exposed port (container) and the host",
});
