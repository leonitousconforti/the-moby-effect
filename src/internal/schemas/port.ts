/**
 * Operating system port schema.
 *
 * @since 1.0.0
 */

import * as Brand from "effect/Brand";
import * as Function from "effect/Function";
import * as Schema from "effect/Schema";
import { Address } from "./address.js";

/**
 * @since 1.0.0
 * @category Branded types
 */
export type PortBrand = number & Brand.Brand<"Port">;

/**
 * @since 1.0.0
 * @category Branded constructors
 */
export const PortBrand = Brand.nominal<PortBrand>();

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $Port extends Schema.Annotable<$Port, PortBrand, Brand.Brand.Unbranded<PortBrand>, never> {}

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
export const Port: $Port = Function.pipe(
    Schema.Int,
    Schema.between(0, 2 ** 16 - 1),
    Schema.fromBrand(PortBrand),
    Schema.annotations({
        identifier: "Port",
        title: "An OS port number",
        description: "An operating system's port number between 0 and 65535 (inclusive)",
    })
);

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $PortWithMaybeProtocol
    extends Schema.Union<
        [
            Schema.TemplateLiteral<`${number}`>,
            Schema.TemplateLiteral<`${number}/tcp`>,
            Schema.TemplateLiteral<`${number}/udp`>,
        ]
    > {}

/**
 * An operating system port number with an optional protocol.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const PortWithMaybeProtocol: $PortWithMaybeProtocol = Schema.Union(
    Schema.TemplateLiteral(Schema.Number),
    Schema.TemplateLiteral(Schema.Number, "/", Schema.Literal("tcp")),
    Schema.TemplateLiteral(Schema.Number, "/", Schema.Literal("udp"))
).annotations({
    identifier: "PortWithMaybeProtocol",
    title: "An OS port number with an optional protocol",
    description: "An operating system's port number with an optional protocol",
});

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $PortSet extends Schema.Record$<$PortWithMaybeProtocol, typeof Schema.Object> {}

/**
 * A set of operating system ports.
 *
 * @since 1.0.0
 * @category Schemas
 * @see https://github.com/docker/go-connections/blob/5df8d2b30ca886f2d94740ce3c54abd58a5bb2c9/nat/nat.go#L23
 */
export const PortSet: $PortSet = Schema.Record({
    key: PortWithMaybeProtocol,
    // FIXME: What is this type?
    value: Schema.Object,
}).annotations({
    identifier: "PortSet",
    title: "A set of OS ports",
    description: "A set of operating system ports",
});

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $PortBinding
    extends Schema.Struct<{
        HostIp: typeof Address;
        HostPort: typeof Port;
    }> {}

/**
 * A port binding between the exposed port (container) and the host.
 *
 * @since 1.0.0
 * @category Schemas
 * @see https://github.com/docker/go-connections/blob/5df8d2b30ca886f2d94740ce3c54abd58a5bb2c9/nat/nat.go#L11-L17
 */
export const PortBinding: $PortBinding = Schema.Struct({
    HostPort: Port,
    HostIp: Address,
}).annotations({
    identifier: "PortBinding",
    title: "nat.PortBinding",
    description: "A port binding between the exposed port (container) and the host",
});

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $PortMap extends Schema.Record$<typeof PortWithMaybeProtocol, Schema.Array$<$PortBinding>> {}

/**
 * Port mapping between the exposed port (container) and the host.
 *
 * @since 1.0.0
 * @category Schemas
 * @see https://github.com/docker/go-connections/blob/5df8d2b30ca886f2d94740ce3c54abd58a5bb2c9/nat/nat.go#L20
 */
export const PortMap: $PortMap = Schema.Record({
    key: PortWithMaybeProtocol,
    value: Schema.Array(PortBinding),
}).annotations({
    identifier: "PortMap",
    title: "nat.PortMap",
    description: "Port mapping between the exposed port (container) and the host",
});
