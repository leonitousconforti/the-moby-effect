/**
 * IPv4 address schema.
 *
 * @since 1.0.0
 */

import * as Schema from "@effect/schema/Schema";
import * as Array from "effect/Array";
import * as Brand from "effect/Brand";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as String from "effect/String";

/**
 * @since 1.0.0
 * @category Regular expressions
 * @see https://github.com/nodejs/node/blob/e08a654fae0ecc91678819e0b62a2e014bad3339/lib/internal/net.js#L16-L18
 */
export const IPv4Segment = "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])";

/**
 * @since 1.0.0
 * @category Regular expressions
 */
export const IPv4StringRegex = `(?:${IPv4Segment}\\.){3}${IPv4Segment}`;

/**
 * @since 1.0.0
 * @category Regular expressions
 */
export const IPv4Regex = new RegExp(`^${IPv4StringRegex}$`);

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
 * @category Api interface
 */
export interface $IPv4String extends Schema.filter<Schema.Schema<string, string, never>> {}

/**
 * An IPv4 address in dot-decimal notation with no leading zeros.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const IPv4String: $IPv4String = Schema.String.pipe(Schema.pattern(IPv4Regex));

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
 *     import { IPv4 } from "the-moby-effect/schemas/index.js";
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
    IPv4String,
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

/**
 * @since 1.0.0
 * @category Branded types
 */
export type IPv4BigintBrand = bigint & Brand.Brand<"IPv4Bigint">;

/**
 * @since 1.0.0
 * @category Branded constructors
 */
export const IPv4BigintBrand = Brand.nominal<IPv4BigintBrand>();

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $IPv4Bigint
    extends Schema.transformOrFail<
        $IPv4,
        Schema.Struct<{
            family: $IPv4Family;
            value: Schema.BrandSchema<IPv4BigintBrand, Brand.Brand.Unbranded<IPv4BigintBrand>, never>;
        }>,
        never
    > {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type IPv4Bigint = Schema.Schema.Type<$IPv4Bigint>;

/**
 * @since 1.0.0
 * @category Encoded types
 */
export type IPv4BigintEncoded = Schema.Schema.Encoded<$IPv4Bigint>;

/**
 * An IPv4 as a bigint.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     import * as Schema from "@effect/schema/Schema";
 *     import {
 *         IPv4Bigint,
 *         IPv4BigintBrand,
 *     } from "the-moby-effect/schemas/IPv4.js";
 *
 *     const x: IPv4BigintBrand = IPv4BigintBrand(748392749382n);
 *     assert.strictEqual(x, 748392749382n);
 *
 *     const decodeIPv4Bigint = Schema.decodeSync(IPv4Bigint);
 *     const encodeIPv4Bigint = Schema.encodeSync(IPv4Bigint);
 *
 *     assert.deepEqual(decodeIPv4Bigint("1.1.1.1"), {
 *         family: "ipv4",
 *         value: 16843009n,
 *     });
 *     assert.deepEqual(decodeIPv4Bigint("254.254.254.254"), {
 *         family: "ipv4",
 *         value: 4278124286n,
 *     });
 *
 *     assert.strictEqual(
 *         encodeIPv4Bigint({
 *             value: IPv4BigintBrand(16843009n),
 *             family: "ipv4",
 *         }),
 *         "1.1.1.1"
 *     );
 *     assert.strictEqual(
 *         encodeIPv4Bigint({
 *             value: IPv4BigintBrand(4278124286n),
 *             family: "ipv4",
 *         }),
 *         "254.254.254.254"
 *     );
 */
export const IPv4Bigint: $IPv4Bigint = Schema.transformOrFail(
    IPv4,
    Schema.Struct({
        family: IPv4Family,
        value: Schema.BigIntFromSelf.pipe(Schema.fromBrand(IPv4BigintBrand)),
    }),
    {
        encode: ({ value }) => {
            const padded = value.toString(16).replace(/:/g, "").padStart(8, "0");
            const groups: Array<number> = [];
            for (let i = 0; i < 8; i += 2) {
                const h = padded.slice(i, i + 2);
                groups.push(parseInt(h, 16));
            }
            return Schema.decode(IPv4)(groups.join(".")).pipe(Effect.mapError(({ issue }) => issue));
        },
        decode: ({ ip }) =>
            Function.pipe(
                ip,
                String.split("."),
                Array.map((s) => Number.parseInt(s, 10)),
                Array.map((n) => n.toString(16)),
                Array.map(String.padStart(2, "0")),
                Array.join(""),
                (hex) => BigInt(`0x${hex}`),
                (value) => ({ value, family: "ipv4" }) as const,
                Effect.succeed
            ),
    }
).annotations({
    identifier: "IPv4Bigint",
    description: "An ipv4 address as a bigint",
});
