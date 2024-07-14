import * as Schema from "@effect/schema/Schema";
import * as IPv4 from "./IPv4.js";
import * as IPv6 from "./IPv6.js";

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $Family extends Schema.Union<[IPv4.$IPv4Family, IPv6.$IPv6Family]> {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type Family = Schema.Schema.Type<$Family>;

/**
 * @since 1.0.0
 * @category Schemas
 * @see {@link IPv4.IPv4Family}
 * @see {@link IPv6.IPv6Family}
 */
export const Family: $Family = Schema.Union(IPv4.IPv4Family, IPv6.IPv6Family).annotations({
    identifier: "Family",
    description: "An ipv4 or ipv6 family",
});
