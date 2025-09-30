/**
 * IPv6 address schema.
 *
 * @since 1.0.0
 */

import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as IPv4 from "./ipv4.js";

/**
 * @since 1.0.0
 * @category Regular expressions
 * @see https://github.com/nodejs/node/blob/e08a654fae0ecc91678819e0b62a2e014bad3339/lib/internal/net.js#L21-L31
 */
export const IPv6Segment = "(?:[0-9a-fA-F]{1,4})";

/**
 * @since 1.0.0
 * @category Regular expressions
 */
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
 * @category Schemas
 */
export class IPv6Family extends Schema.Literal("ipv6").annotations({
    identifier: "IPv6Family",
    description: "An ipv6 family",
}) {}

/**
 * An IPv6 address in string format.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const IPv6String = Schema.String.pipe(Schema.pattern(IPv6Regex));

/**
 * An IPv6 address.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     import * as Schema from "effect/Schema";
 *     import { IPv6 } from "the-moby-effect/schemas/index.js";
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
export class IPv6 extends Schema.transform(
    IPv6String,
    Schema.Struct({
        family: IPv6Family,
        ip: Schema.String.pipe(Schema.brand("IPv6")),
    }),
    {
        encode: ({ ip }) => ip,
        decode: (ip) => ({ ip, family: "ipv6" }) as const,
    }
).annotations({
    identifier: "IPv6",
    description: "An ipv6 address",
}) {}

/**
 * An IPv6 as a bigint.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     import * as Schema from "effect/Schema";
 *     import {
 *         IPv6Bigint,
 *         IPv6BigintBrand,
 *     } from "the-moby-effect/schemas/IPv6.js";
 *
 *     const y: IPv6BigintBrand = IPv6BigintBrand(748392749382n);
 *     assert.strictEqual(y, 748392749382n);
 *
 *     const decodeIPv6Bigint = Schema.decodeSync(IPv6Bigint);
 *     const encodeIPv6Bigint = Schema.encodeSync(IPv6Bigint);
 *
 *     assert.deepEqual(
 *         decodeIPv6Bigint("4cbd:ff70:e62b:a048:686c:4e7e:a68a:c377"),
 *         { value: 102007852745154114519525620108359287671n, family: "ipv6" }
 *     );
 *     assert.deepEqual(
 *         decodeIPv6Bigint("d8c6:3feb:46e6:b80c:5a07:6227:ac19:caf6"),
 *         { value: 288142618299897818094313964584331496182n, family: "ipv6" }
 *     );
 *
 *     assert.deepEqual(
 *         encodeIPv6Bigint({
 *             value: IPv6BigintBrand(102007852745154114519525620108359287671n),
 *             family: "ipv6",
 *         }),
 *         "4cbd:ff70:e62b:a048:686c:4e7e:a68a:c377"
 *     );
 *     assert.deepEqual(
 *         encodeIPv6Bigint({
 *             value: IPv6BigintBrand(288142618299897818094313964584331496182n),
 *             family: "ipv6",
 *         }),
 *         "d8c6:3feb:46e6:b80c:5a07:6227:ac19:caf6"
 *     );
 */
export class IPv6Bigint extends Schema.transformOrFail(
    IPv6,
    Schema.Struct({
        family: IPv6Family,
        value: Schema.BigIntFromSelf.pipe(Schema.brand("IPv6Bigint")),
    }),
    {
        encode: ({ value }) => {
            const hex = value.toString(16).padStart(32, "0");
            const groups = [];
            for (let i = 0; i < 8; i++) {
                groups.push(hex.slice(i * 4, (i + 1) * 4));
            }
            return Schema.decode(IPv6)(groups.join(":")).pipe(Effect.mapError(({ issue }) => issue));
        },
        decode: ({ ip }) => {
            function paddedHex(octet: string): string {
                return parseInt(octet, 16).toString(16).padStart(4, "0");
            }

            let groups: Array<string> = [];
            const halves = ip.split("::");

            if (halves.length === 2) {
                let first = halves[0]!.split(":");
                let last = halves[1]!.split(":");

                if (first.length === 1 && first[0] === "") {
                    first = [];
                }
                if (last.length === 1 && last[0] === "") {
                    last = [];
                }

                const remaining = 8 - (first.length + last.length);
                if (!remaining) {
                    throw new Error("Error parsing groups");
                }

                groups = groups.concat(first);
                for (let i = 0; i < remaining; i++) {
                    groups.push("0");
                }
                groups = groups.concat(last);
            } else if (halves.length === 1) {
                groups = ip.split(":");
            } else {
                throw new Error("Too many :: groups found");
            }

            groups = groups.map((group: string) => parseInt(group, 16).toString(16));
            if (groups.length !== 8) {
                throw new Error("Invalid number of groups");
            }

            return Effect.succeed({ value: BigInt(`0x${groups.map(paddedHex).join("")}`), family: "ipv6" } as const);
        },
    }
).annotations({
    identifier: "IPv6Bigint",
    description: "An ipv6 address as a bigint",
}) {}
