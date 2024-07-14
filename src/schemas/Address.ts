import * as Schema from "@effect/schema/Schema";
import * as IPv4 from "./IPv4.js";
import * as IPv6 from "./IPv6.js";

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $Address extends Schema.Union<[IPv4.$IPv4, IPv6.$IPv6]> {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type Address = Schema.Schema.Type<$Address>;

/**
 * @since 1.0.0
 * @category Encoded types
 */
export type AddressEncoded = Schema.Schema.Encoded<$Address>;

/**
 * An IP address, which is either an IPv4 or IPv6 address.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     import * as Schema from "@effect/schema/Schema";
 *     import { Address } from "the-wireguard-effect/InternetSchemas";
 *
 *     const decodeAddress = Schema.decodeSync(Address);
 *
 *     assert.throws(() => decodeAddress("1.1.b.1"));
 *     assert.throws(() =>
 *         decodeAddress("2001:0db8:85a3:0000:0000:8a2e:0370:7334:")
 *     );
 *
 *     assert.doesNotThrow(() => decodeAddress("1.1.1.2"));
 *     assert.doesNotThrow(() =>
 *         decodeAddress("2001:0db8:85a3:0000:0000:8a2e:0370:7334")
 *     );
 *
 * @see {@link IPv4.IPv4}
 * @see {@link IPv6.IPv6}
 */
export const Address: $Address = Schema.Union(IPv4.IPv4, IPv6.IPv6).annotations({
    identifier: "Address",
    description: "An ipv4 or ipv6 address",
});
