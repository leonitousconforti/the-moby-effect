/**
 * IPv4 or IPv6 cidr block schemas.
 *
 * @since 1.0.0
 */

import type * as Family from "./family.js";

import * as Array from "effect/Array";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as ParseResult from "effect/ParseResult";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";
import * as Address from "./address.js";
import * as CidrBlockMask from "./cidrBlockMask.js";
import * as IPv4 from "./ipv4.js";
import * as IPv6 from "./ipv6.js";

/** @internal */
type Tail<T extends ReadonlyArray<unknown>> = T extends
    | [infer _First, ...infer Rest]
    | readonly [infer _First, ...infer Rest]
    ? Rest
    : Array<unknown>;

/** @internal */
type Split<Str extends string, Delimiter extends string> = string extends Str | ""
    ? Array<string>
    : Str extends `${infer Head}${Delimiter}${infer Rest}`
      ? [Head, ...Split<Rest, Delimiter>]
      : [Str];

/** @internal */
export const tail = <T extends ReadonlyArray<unknown>>(elements: T): Tail<T> => elements.slice(1) as Tail<T>;

/** @internal */
export const splitLiteral = <Str extends string, Delimiter extends string>(
    str: Str,
    delimiter: Delimiter
): Split<Str, Delimiter> => str.split(delimiter) as Split<Str, Delimiter>;

/**
 * @since 1.0.0
 * @category Api interface
 */
export class CidrBlockBase<_Family extends Family.Family> extends Schema.Class<CidrBlockBase<Family.Family>>(
    "CidrBlockMixin"
)({
    address: Address.Address,
    mask: Schema.Union(CidrBlockMask.IPv4CidrMask, CidrBlockMask.IPv6CidrMask),
}) {
    /** @since 1.0.0 */
    public readonly family: Family.Family = this.address.family;

    /** @internal */
    private onFamily<OnIPv4, OnIPv6>({
        onIPv4,
        onIPv6,
    }: {
        onIPv4: (self: CidrBlockBase<"ipv4">) => OnIPv4;
        onIPv6: (self: CidrBlockBase<"ipv6">) => OnIPv6;
    }): _Family extends IPv4.IPv4Family ? OnIPv4 : _Family extends IPv6.IPv6Family ? OnIPv6 : never {
        type Ret = typeof this.address.family extends IPv4.IPv4Family
            ? OnIPv4
            : typeof this.address.family extends IPv6.IPv6Family
              ? OnIPv6
              : never;

        const isIPv4 = (): this is CidrBlockBase<"ipv4"> => this.family === "ipv4";
        const isIPv6 = (): this is CidrBlockBase<"ipv6"> => this.family === "ipv6";

        if (isIPv4()) {
            return onIPv4(this as CidrBlockBase<"ipv4">) as Ret;
        } else if (isIPv6()) {
            return onIPv6(this as CidrBlockBase<"ipv6">) as Ret;
        } else {
            return Function.absurd<Ret>(this.family as never);
        }
    }

    /**
     * The first address in the range given by this address' subnet, often
     * referred to as the Network Address.
     *
     * @since 1.0.0
     */
    protected get networkAddressAsBigint(): Effect.Effect<
        _Family extends IPv4.IPv4Family
            ? IPv4.IPv4BigintBrand
            : _Family extends IPv6.IPv6Family
              ? IPv6.IPv6BigintBrand
              : never,
        ParseResult.ParseError,
        never
    > {
        return Effect.gen(this, function* () {
            const bits = this.family === "ipv4" ? 32 : 128;
            const bigIntegerAddress = yield* this.onFamily({
                onIPv4: (self) => Schema.decode(IPv4.IPv4Bigint)(self.address.ip),
                onIPv6: (self) => Schema.decode(IPv6.IPv6Bigint)(self.address.ip),
            });
            const intermediate = bigIntegerAddress.value.toString(2).padStart(bits, "0").slice(0, this.mask);
            const networkAddressString = intermediate + "0".repeat(bits - this.mask);
            const networkAddressBigInt = BigInt(`0b${networkAddressString}`);
            return this.onFamily({
                onIPv4: (_self) => IPv4.IPv4BigintBrand(networkAddressBigInt),
                onIPv6: (_self) => IPv6.IPv6BigintBrand(networkAddressBigInt),
            });
        });
    }

    /**
     * The first address in the range given by this address' subnet, often
     * referred to as the Network Address.
     *
     * @since 1.0.0
     */
    public networkAddress(): _Family extends IPv4.IPv4Family
        ? Effect.Effect<IPv4.IPv4, ParseResult.ParseError, never>
        : _Family extends IPv6.IPv6Family
          ? Effect.Effect<IPv6.IPv6, ParseResult.ParseError, never>
          : never {
        return this.onFamily({
            onIPv4: (self) =>
                Function.pipe(
                    self.networkAddressAsBigint,
                    Effect.flatMap((value) => Schema.encode(IPv4.IPv4Bigint)({ value, family: "ipv4" })),
                    Effect.flatMap(Schema.decode(IPv4.IPv4))
                ),
            onIPv6: (self) =>
                Function.pipe(
                    self.networkAddressAsBigint,
                    Effect.flatMap((value) => Schema.encode(IPv6.IPv6Bigint)({ value, family: "ipv6" })),
                    Effect.flatMap(Schema.decode(IPv6.IPv6))
                ),
        });
    }

    /**
     * The last address in the range given by this address' subnet, often
     * referred to as the Broadcast Address.
     *
     * @since 1.0.0
     */
    protected get broadcastAddressAsBigint(): Effect.Effect<
        _Family extends IPv4.IPv4Family
            ? IPv4.IPv4BigintBrand
            : _Family extends IPv6.IPv6Family
              ? IPv6.IPv6BigintBrand
              : never,
        ParseResult.ParseError,
        never
    > {
        return Effect.gen(this, function* () {
            const bits = this.family === "ipv4" ? 32 : 128;
            const bigIntegerAddress = yield* this.onFamily({
                onIPv4: (self) => Schema.decode(IPv4.IPv4Bigint)(self.address.ip),
                onIPv6: (self) => Schema.decode(IPv6.IPv6Bigint)(self.address.ip),
            });
            const intermediate = bigIntegerAddress.value.toString(2).padStart(bits, "0").slice(0, this.mask);
            const broadcastAddressString = intermediate + "1".repeat(bits - this.mask);
            const broadcastAddressBigInt = BigInt(`0b${broadcastAddressString}`);
            return this.onFamily({
                onIPv4: (_self) => IPv4.IPv4BigintBrand(broadcastAddressBigInt),
                onIPv6: (_self) => IPv6.IPv6BigintBrand(broadcastAddressBigInt),
            });
        });
    }

    /**
     * The last address in the range given by this address' subnet, often
     * referred to as the Broadcast Address.
     *
     * @since 1.0.0
     */
    public broadcastAddress(): _Family extends IPv4.IPv4Family
        ? Effect.Effect<IPv4.IPv4, ParseResult.ParseError, never>
        : _Family extends IPv6.IPv6Family
          ? Effect.Effect<IPv6.IPv6, ParseResult.ParseError, never>
          : never {
        return this.onFamily({
            onIPv4: (self) =>
                Function.pipe(
                    self.broadcastAddressAsBigint,
                    Effect.flatMap((value) => Schema.encode(IPv4.IPv4Bigint)({ value, family: "ipv4" })),
                    Effect.flatMap(Schema.decode(IPv4.IPv4))
                ),
            onIPv6: (self) =>
                Function.pipe(
                    self.broadcastAddressAsBigint,
                    Effect.flatMap((value) => Schema.encode(IPv6.IPv6Bigint)({ value, family: "ipv6" })),
                    Effect.flatMap(Schema.decode(IPv6.IPv6))
                ),
        });
    }

    /**
     * A stream of all addresses in the range given by this address' subnet.
     *
     * @since 1.0.0
     */
    public get range(): _Family extends IPv4.IPv4Family
        ? Stream.Stream<IPv4.IPv4, ParseResult.ParseError, never>
        : _Family extends IPv6.IPv6Family
          ? Stream.Stream<IPv6.IPv6, ParseResult.ParseError, never>
          : never {
        return this.onFamily({
            onIPv4: (self) =>
                Effect.gen(function* () {
                    const minValue = yield* self.networkAddressAsBigint;
                    const maxValue = yield* self.broadcastAddressAsBigint;
                    return Function.pipe(
                        Stream.iterate(minValue, (x) => IPv4.IPv4BigintBrand(x + 1n)),
                        Stream.takeWhile((n) => n <= maxValue),
                        Stream.flatMap((value) => Schema.encode(IPv4.IPv4Bigint)({ value, family: "ipv4" })),
                        Stream.mapEffect(Schema.decode(IPv4.IPv4))
                    );
                }).pipe(Stream.unwrap),
            onIPv6: (self) =>
                Effect.gen(function* () {
                    const minValue = yield* self.networkAddressAsBigint;
                    const maxValue = yield* self.broadcastAddressAsBigint;
                    return Function.pipe(
                        Stream.iterate(minValue, (x) => IPv6.IPv6BigintBrand(x + 1n)),
                        Stream.takeWhile((n) => n <= maxValue),
                        Stream.flatMap((value) => Schema.encode(IPv6.IPv6Bigint)({ value, family: "ipv6" })),
                        Stream.mapEffect(Schema.decode(IPv6.IPv6))
                    );
                }).pipe(Stream.unwrap),
        });
    }

    /**
     * The total number of addresses in the range given by this address' subnet.
     *
     * @since 1.0.0
     */
    public get total(): Effect.Effect<bigint, ParseResult.ParseError, never> {
        return Effect.gen(this, function* () {
            const minValue: bigint = yield* this.networkAddressAsBigint;
            const maxValue: bigint = yield* this.broadcastAddressAsBigint;
            return maxValue - minValue + 1n;
        });
    }

    /**
     * Finds the smallest CIDR block that contains all the given IP addresses.
     *
     * @since 1.0.0
     */
    public static readonly cidrBlockForRange = <_Family extends Family.Family>(
        inputs: _Family extends IPv4.IPv4Family
            ? Array.NonEmptyReadonlyArray<IPv4.IPv4>
            : Array.NonEmptyReadonlyArray<IPv6.IPv6>
    ): _Family extends IPv4.IPv4Family
        ? Effect.Effect<CidrBlockBase<"ipv4">, ParseResult.ParseError, never>
        : Effect.Effect<CidrBlockBase<"ipv6">, ParseResult.ParseError, never> =>
        Effect.gen(function* () {
            const bigIntMinAndMax = (args: Array.NonEmptyReadonlyArray<bigint>) => {
                return args.reduce(
                    ([min, max], e) => {
                        return [e < min ? e : min, e > max ? e : max] as const;
                    },
                    [args[0], args[0]] as const
                );
            };

            const bigints = yield* Function.pipe(
                inputs as Array.NonEmptyReadonlyArray<IPv4.IPv4 | IPv6.IPv6>,
                Array.map((address) =>
                    address.family === "ipv4"
                        ? Schema.decode(IPv4.IPv4Bigint)(address.ip)
                        : Schema.decode(IPv6.IPv6Bigint)(address.ip)
                ),
                Array.map((x) => x as Effect.Effect<IPv4.IPv4Bigint | IPv6.IPv6Bigint, ParseResult.ParseError, never>),
                Array.map(Effect.map(({ value }) => value)),
                Effect.all
            );

            const bits = inputs[0].family === "ipv4" ? 32 : 128;
            const [min, max] = bigIntMinAndMax(bigints);
            const leadingZerosInMin = bits - min.toString(2).length;
            const leadingZerosInMax = bits - max.toString(2).length;

            const cidrMask = Math.min(leadingZerosInMin, leadingZerosInMax);
            const cidrAddress =
                inputs[0].family === "ipv4"
                    ? yield* Schema.encode(IPv4.IPv4Bigint)({ value: IPv4.IPv4BigintBrand(min), family: "ipv4" })
                    : yield* Schema.encode(IPv6.IPv6Bigint)({ value: IPv6.IPv6BigintBrand(min), family: "ipv6" });

            return yield* Schema.decode(CidrBlockFromString)(`${cidrAddress}/${cidrMask}`);
        }) as _Family extends IPv4.IPv4Family
            ? Effect.Effect<CidrBlockBase<"ipv4">, ParseResult.ParseError, never>
            : Effect.Effect<CidrBlockBase<"ipv6">, ParseResult.ParseError, never>;
}

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $IPv4CidrBlock
    extends Schema.Annotable<
        $IPv4CidrBlock,
        CidrBlockBase<"ipv4">,
        {
            readonly address: string;
            readonly mask: number;
        },
        never
    > {}

// export interface $IPv4CidrBlock
//     extends Schema.transformOrFail<
//         Schema.Struct<{
//             address: $IPv4;
//             mask: $IPv4CidrMask;
//         }>,
//         typeof CidrBlockBase<"ipv4">,
//         never
//     > {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type IPv4CidrBlock = CidrBlockBase<"ipv4">;

/**
 * @since 1.0.0
 * @category Encoded types
 */
export type IPv4CidrBlockEncoded = Schema.Schema.Encoded<$IPv4CidrBlock>;

/**
 * @since 1.0.0
 * @category Schemas
 */
export const IPv4CidrBlock: $IPv4CidrBlock = Schema.transformOrFail(
    Schema.Struct({ address: IPv4.IPv4, mask: CidrBlockMask.IPv4CidrMask }),
    CidrBlockBase,
    {
        encode: (data) =>
            Effect.gen(function* () {
                const address = yield* Schema.decode(IPv4.IPv4)(data.address);
                const mask = yield* Schema.decode(CidrBlockMask.IPv4CidrMask)(data.mask);
                return { address, mask } as const;
            }).pipe(Effect.mapError(({ issue }) => issue)),
        decode: (data) => ParseResult.succeed({ address: data.address.ip, mask: data.mask }),
    }
).annotations({
    identifier: "IPv4CidrBlock",
    description: "An ipv4 cidr block",
});

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $IPv4CidrBlockFromString
    extends Schema.Annotable<$IPv4CidrBlockFromString, CidrBlockBase<"ipv4">, `${string}/${number}`, never> {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type IPv4CidrBlockFromString = Schema.Schema.Type<$IPv4CidrBlockFromString>;

/**
 * @since 1.0.0
 * @category Encoded types
 */
export type IPv4CidrBlockFromStringEncoded = Schema.Schema.Encoded<$IPv4CidrBlockFromString>;

/**
 * A schema that transforms a `string` into a `CidrBlock`.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const IPv4CidrBlockFromString: $IPv4CidrBlockFromString = Schema.transform(
    Schema.TemplateLiteral(Schema.String, Schema.Literal("/"), Schema.Number),
    IPv4CidrBlock,
    {
        decode: (str) => {
            const [address, mask] = splitLiteral(str, "/");
            return { address, mask: Number.parseInt(mask, 10) } as const;
        },
        encode: ({ address, mask }) => `${address}/${mask}` as const,
    }
).annotations({
    identifier: "IPv4CidrBlockFromString",
    description: "An ipv4 cidr block from string",
});

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $IPv6CidrBlock
    extends Schema.transformOrFail<
        Schema.Struct<{
            address: IPv6.$IPv6;
            mask: CidrBlockMask.$IPv6CidrMask;
        }>,
        typeof CidrBlockBase<"ipv6">,
        never
    > {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type IPv6CidrBlock = CidrBlockBase<"ipv6">;

/**
 * @since 1.0.0
 * @category Encoded types
 */
export type IPv6CidrBlockEncoded = Schema.Schema.Encoded<$IPv6CidrBlock>;

/**
 * @since 1.0.0
 * @category Schemas
 */
export const IPv6CidrBlock: $IPv6CidrBlock = Schema.transformOrFail(
    Schema.Struct({ address: IPv6.IPv6, mask: CidrBlockMask.IPv6CidrMask }),
    CidrBlockBase,
    {
        encode: (data) =>
            Effect.gen(function* () {
                const address = yield* Schema.decode(IPv6.IPv6)(data.address);
                const mask = yield* Schema.decode(CidrBlockMask.IPv6CidrMask)(data.mask);
                return { address, mask } as const;
            }).pipe(Effect.mapError(({ issue }) => issue)),
        decode: (data) => ParseResult.succeed({ address: data.address.ip, mask: data.mask }),
    }
).annotations({
    identifier: "IPv6CidrBlock",
    description: "An ipv6 cidr block",
});

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $IPv6CidrBlockFromString
    extends Schema.Annotable<$IPv6CidrBlockFromString, CidrBlockBase<"ipv6">, `${string}/${number}`, never> {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type IPv6CidrBlockFromString = Schema.Schema.Type<$IPv6CidrBlockFromString>;

/**
 * @since 1.0.0
 * @category Encoded types
 */
export type IPv6CidrBlockFromStringEncoded = Schema.Schema.Encoded<$IPv6CidrBlockFromString>;

/**
 * A schema that transforms a `string` into a `CidrBlock`.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const IPv6CidrBlockFromString: $IPv6CidrBlockFromString = Schema.transform(
    Schema.TemplateLiteral(Schema.String, Schema.Literal("/"), Schema.Number),
    IPv6CidrBlock,
    {
        decode: (str) => {
            const [address, mask] = splitLiteral(str, "/");
            return { address, mask: Number.parseInt(mask, 10) } as const;
        },
        encode: ({ address, mask }) => `${address}/${mask}` as const,
    }
).annotations({
    identifier: "IPv6CidrBlockFromString",
    description: "An ipv6 cidr block from string",
});

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $CidrBlock extends Schema.Union<[$IPv4CidrBlock, $IPv6CidrBlock]> {}

/**
 * @since 1.0.0
 * @category Schemas
 */
export const CidrBlock: $CidrBlock = Schema.Union(IPv4CidrBlock, IPv6CidrBlock);

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $CidrBlockFromString
    extends Schema.Annotable<
        $CidrBlockFromString,
        CidrBlockBase<"ipv4"> | CidrBlockBase<"ipv6">,
        `${string}/${number}`,
        never
    > {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type CidrBlockFromString = Schema.Schema.Type<$CidrBlockFromString>;

/**
 * @since 1.0.0
 * @category Encoded types
 */
export type CidrBlockFromStringEncoded = Schema.Schema.Encoded<$CidrBlockFromString>;

/**
 * A schema that transforms a `string` into a `CidrBlock`.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const CidrBlockFromString: $CidrBlockFromString = Schema.transform(
    Schema.TemplateLiteral(Schema.String, Schema.Literal("/"), Schema.Number),
    CidrBlock,
    {
        decode: (str) => {
            const [address, mask] = splitLiteral(str, "/");
            return { address, mask: Number.parseInt(mask, 10) } as const;
        },
        encode: ({ address, mask }) => `${address}/${mask}` as const,
    }
).annotations({
    identifier: "CidrBlockFromString",
    description: "A cidr block",
});
