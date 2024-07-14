import * as Schema from "@effect/schema/Schema";
import * as Brand from "effect/Brand";
import * as Function from "effect/Function";
import * as IPv4 from "./IPv4.js";

/**
 * @internal
 * @see https://github.com/nodejs/node/blob/e08a654fae0ecc91678819e0b62a2e014bad3339/lib/internal/net.js#L21-L31
 */
export const IPv6Segment = "(?:[0-9a-fA-F]{1,4})";

/** @internal */
export const IPv6Regex = new RegExp(
    "^(?:" +
        `(?:${IPv6Segment}:){7}(?:${IPv6Segment}|:)|` +
        `(?:${IPv6Segment}:){6}(?:${IPv4.IPv4String}|:${IPv6Segment}|:)|` +
        `(?:${IPv6Segment}:){5}(?::${IPv4.IPv4String}|(?::${IPv6Segment}){1,2}|:)|` +
        `(?:${IPv6Segment}:){4}(?:(?::${IPv6Segment}){0,1}:${IPv4.IPv4String}|(?::${IPv6Segment}){1,3}|:)|` +
        `(?:${IPv6Segment}:){3}(?:(?::${IPv6Segment}){0,2}:${IPv4.IPv4String}|(?::${IPv6Segment}){1,4}|:)|` +
        `(?:${IPv6Segment}:){2}(?:(?::${IPv6Segment}){0,3}:${IPv4.IPv4String}|(?::${IPv6Segment}){1,5}|:)|` +
        `(?:${IPv6Segment}:){1}(?:(?::${IPv6Segment}){0,4}:${IPv4.IPv4String}|(?::${IPv6Segment}){1,6}|:)|` +
        `(?::(?:(?::${IPv6Segment}){0,5}:${IPv4.IPv4String}|(?::${IPv6Segment}){1,7}|:))` +
        ")(?:%[0-9a-zA-Z-.:]{1,})?$"
);

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $IPv6Family extends Schema.Literal<["ipv6"]> {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type IPv6Family = Schema.Schema.Type<$IPv6Family>;

/**
 * @since 1.0.0
 * @category Schemas
 */
export const IPv6Family: $IPv6Family = Schema.Literal("ipv6").annotations({
    identifier: "IPv6Family",
    description: "An ipv6 family",
});

/**
 * @since 1.0.0
 * @category Branded types
 */
export type IPv6Brand = string & Brand.Brand<"IPv6">;

/**
 * @since 1.0.0
 * @category Branded constructors
 */
export const IPv6Brand = Brand.nominal<IPv6Brand>();

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $IPv6
    extends Schema.transform<
        Schema.filter<Schema.Schema<string, string, never>>,
        Schema.Struct<{
            family: $IPv6Family;
            ip: Schema.BrandSchema<IPv6Brand, Brand.Brand.Unbranded<IPv6Brand>, never>;
        }>
    > {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type IPv6 = Schema.Schema.Type<$IPv6>;

/**
 * @since 1.0.0
 * @category Encoded types
 */
export type IPv6Encoded = Schema.Schema.Encoded<$IPv6>;

/**
 * An IPv6 address.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     import * as Schema from "@effect/schema/Schema";
 *     import { IPv6 } from "the-wireguard-effect/InternetSchemas";
 *
 *     const decodeIPv6 = Schema.decodeSync(IPv6);
 *     assert.deepEqual(decodeIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334"), {
 *         family: "ipv6",
 *         ip: "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
 *     });
 *
 *     assert.throws(() =>
 *         decodeIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334:")
 *     );
 *     assert.throws(() => decodeIPv6("2001::85a3::0000::0370:7334"));
 *     assert.doesNotThrow(() =>
 *         decodeIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334")
 *     );
 */
export const IPv6: $IPv6 = Schema.transform(
    Function.pipe(Schema.String, Schema.pattern(IPv6Regex)),
    Schema.Struct({
        family: IPv6Family,
        ip: Schema.String.pipe(Schema.fromBrand(IPv6Brand)),
    }),
    {
        encode: ({ ip }) => ip,
        decode: (ip) => ({ ip, family: "ipv6" }) as const,
    }
).annotations({
    identifier: "IPv6",
    description: "An ipv6 address",
});
