import * as Schema from "@effect/schema/Schema";
import * as Brand from "effect/Brand";
import * as Function from "effect/Function";

/**
 * @internal
 * @see https://github.com/nodejs/node/blob/e08a654fae0ecc91678819e0b62a2e014bad3339/lib/internal/net.js#L16-L18
 */
export const IPv4Segment = "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])";

/** @internal */
export const IPv4String = `(?:${IPv4Segment}\\.){3}${IPv4Segment}`;

/** @internal */
export const IPv4Regex = new RegExp(`^${IPv4String}$`);

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $IPv4Family extends Schema.Literal<["ipv4"]> {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type IPv4Family = Schema.Schema.Type<$IPv4Family>;

/**
 * @since 1.0.0
 * @category Schemas
 */
export const IPv4Family: $IPv4Family = Schema.Literal("ipv4").annotations({
    identifier: "IPv4Family",
    description: "An ipv4 family",
});

/**
 * @since 1.0.0
 * @category Branded types
 */
export type IPv4Brand = string & Brand.Brand<"IPv4">;

/**
 * @since 1.0.0
 * @category Branded constructors
 */
export const IPv4Brand = Brand.nominal<IPv4Brand>();

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $IPv4
    extends Schema.transform<
        Schema.filter<Schema.Schema<string, string, never>>,
        Schema.Struct<{
            family: $IPv4Family;
            ip: Schema.BrandSchema<IPv4Brand, Brand.Brand.Unbranded<IPv4Brand>, never>;
        }>
    > {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type IPv4 = Schema.Schema.Type<$IPv4>;

/**
 * @since 1.0.0
 * @category Encoded types
 */
export type IPv4Encoded = Schema.Schema.Encoded<$IPv4>;

/**
 * An IPv4 address.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     import * as Schema from "@effect/schema/Schema";
 *     import { IPv4 } from "the-wireguard-effect/InternetSchemas";
 *
 *     const decodeIPv4 = Schema.decodeSync(IPv4);
 *     assert.deepEqual(decodeIPv4("1.1.1.1"), {
 *         family: "ipv4",
 *         ip: "1.1.1.1",
 *     });
 *
 *     assert.throws(() => decodeIPv4("1.1.a.1"));
 *     assert.doesNotThrow(() => decodeIPv4("1.1.1.2"));
 */
export const IPv4: $IPv4 = Schema.transform(
    Function.pipe(Schema.String, Schema.pattern(IPv4Regex)),
    Schema.Struct({
        family: IPv4Family,
        ip: Schema.String.pipe(Schema.fromBrand(IPv4Brand)),
    }),
    {
        encode: ({ ip }) => ip,
        decode: (ip) => ({ ip, family: "ipv4" }) as const,
    }
).annotations({
    identifier: "IPv4",
    title: "An ipv4 address",
    description: "An ipv4 address in dot-decimal notation with no leading zeros",
});
