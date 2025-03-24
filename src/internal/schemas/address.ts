/**
 * IPv4 or IPv6 addresses schema.
 *
 * @since 1.0.0
 */

import * as Schema from "effect/Schema";
import * as IPv4 from "./ipv4.js";
import * as IPv6 from "./ipv6.js";

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $AddressString extends Schema.Union<[IPv4.$IPv4String, IPv6.$IPv6String]> {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type AddressString = Schema.Schema.Type<$AddressString>;

/**
 * @since 1.0.0
 * @category Encoded types
 */
export type AddressStringEncoded = Schema.Schema.Encoded<$AddressString>;

/**
 * An IP address in string format, which is either an IPv4 or IPv6 address.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const AddressString: $AddressString = Schema.Union(IPv4.IPv4String, IPv6.IPv6String).annotations({
    identifier: "AddressString",
    description: "An ipv4 or ipv6 address in string format",
});

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
 *     import * as Schema from "effect/Schema";
 *     import { Address } from "the-moby-effect/schemas/index.js";
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

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $AddressBigint extends Schema.Union<[IPv4.$IPv4Bigint, IPv6.$IPv6Bigint]> {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type AddressBigint = Schema.Schema.Type<$AddressBigint>;

/**
 * @since 1.0.0
 * @category Encoded types
 */
export type AddressBigintEncoded = Schema.Schema.Encoded<$AddressBigint>;

/**
 * An IP address as a bigint.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const AddressBigint: $AddressBigint = Schema.Union(IPv4.IPv4Bigint, IPv6.IPv6Bigint).annotations({
    identifier: "AddressBigint",
    description: "An ipv4 or ipv6 address as a bigint",
});
