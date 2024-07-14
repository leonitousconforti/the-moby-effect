/**
 * Operating system port schema.
 *
 * @since 1.0.0
 */

import * as Schema from "@effect/schema/Schema";
import * as Brand from "effect/Brand";
import * as Function from "effect/Function";

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
 *     import * as Schema from "@effect/schema/Schema";
 *     import { Port, PortBrand } from "the-wireguard-effect/InternetSchemas";
 *
 *     const port: PortBrand = PortBrand(8080);
 *     assert.strictEqual(port, 8080);
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
