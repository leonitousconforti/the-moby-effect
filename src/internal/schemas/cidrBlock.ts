/**
 * IPv4 or IPv6 cidr block schemas.
 *
 * @since 1.0.0
 */

import * as Effect from "effect/Effect";
import * as ParseResult from "effect/ParseResult";
import * as Schema from "effect/Schema";
import * as CidrBlockMask from "./internet/cidrBlockMask.js";
import * as IPv4 from "./internet/ipv4.js";
import * as IPv6 from "./internet/ipv6.js";

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
export const splitLiteral = <const Str extends string, const Delimiter extends string>(
    str: Str,
    delimiter: Delimiter
): Split<Str, Delimiter> => str.split(delimiter) as Split<Str, Delimiter>;

/**
 * @since 1.0.0
 * @category Schemas
 */
export function CidrBlockMixin<
    Self,
    Fields extends
        | { address: typeof IPv4.IPv4; mask: typeof CidrBlockMask.IPv4CidrMask }
        | { address: typeof IPv6.IPv6; mask: typeof CidrBlockMask.IPv6CidrMask },
>(
    Base: Schema.Class<
        Self,
        Fields,
        Schema.Struct.Encoded<Fields>,
        Schema.Struct.Context<Fields>,
        Schema.Struct.Constructor<Fields>,
        {},
        {}
    >
) {
    // function onFamily<OnIPv4, OnIPv6>({
    //     onIPv4,
    //     onIPv6,
    // }: {
    //     onIPv4: (self: typeof CidrBlockMixin<"ipv4">) => OnIPv4;
    //     onIPv6: (self: typeof CidrBlockMixin<"ipv6">) => OnIPv6;
    // }): _Family extends Schema.Schema.Type<IPv4.IPv4Family>
    //     ? OnIPv4
    //     : _Family extends Schema.Schema.Type<IPv6.IPv6Family>
    //       ? OnIPv6
    //       : never {
    //     type Ret =
    //         typeof base.fields.address.family extends Schema.Schema.Type<IPv4.IPv4Family>
    //             ? OnIPv4
    //             : typeof this.address.family extends Schema.Schema.Type<IPv6.IPv6Family>
    //               ? OnIPv6
    //               : never;

    //     const isIPv4 = (): this is CidrBlockMixin<"ipv4"> => this.address.family === "ipv4";
    //     const isIPv6 = (): this is CidrBlockMixin<"ipv6"> => this.address.family === "ipv6";

    //     if (isIPv4()) {
    //         return onIPv4(this as CidrBlockMixin<"ipv4">) as Ret;
    //     } else if (isIPv6()) {
    //         return onIPv6(this as CidrBlockMixin<"ipv6">) as Ret;
    //     } else {
    //         return Function.absurd<Ret>(this.address.family as never);
    //     }
    // }

    const klass = class CidrBlockBase extends Base {
        static [Schema.TypeId] = {
            _A: (_: any) => _,
            _I: (_: any) => _,
            _R: (_: never) => _,
        };

        // /**
        //  * The first address in the range given by this address' subnet, often
        //  * referred to as the Network Address.
        //  *
        //  * @since 1.0.0
        //  */
        // public get networkAddressAsBigint(): _Family extends Schema.Schema.Type<IPv4.IPv4Family>
        //     ? Schema.Schema.Type<IPv4.IPv4Bigint>
        //     : _Family extends Schema.Schema.Type<IPv6.IPv6Family>
        //       ? Schema.Schema.Type<IPv6.IPv6Bigint>
        //       : never {
        //     const bits = this.address.family === "ipv4" ? 32 : 128;
        //     const bigIntegerAddress = this.onFamily({
        //         onIPv4: (self) => Schema.decodeSync(IPv4.IPv4Bigint)(self.address.ip),
        //         onIPv6: (self) => Schema.decodeSync(IPv6.IPv6Bigint)(self.address.ip),
        //     });
        //     const intermediate = bigIntegerAddress.value.toString(2).padStart(bits, "0").slice(0, this.mask);
        //     const networkAddressString = intermediate + "0".repeat(bits - this.mask);
        //     const networkAddressBigInt = BigInt(`0b${networkAddressString}`);
        //     return this.onFamily({
        //         onIPv4: (self) => ({
        //             family: self.address.family,
        //             value: IPv4.IPv4Bigint.to["fields"]["value"].make(networkAddressBigInt),
        //         }),
        //         onIPv6: (self) => ({
        //             family: self.address.family,
        //             value: IPv6.IPv6Bigint.to["fields"]["value"].make(networkAddressBigInt),
        //         }),
        //     });
        // }
        // /**
        //  * The first address in the range given by this address' subnet, often
        //  * referred to as the Network Address.
        //  *
        //  * @since 1.0.0
        //  */
        // public networkAddress(): _Family extends Schema.Schema.Type<IPv4.IPv4Family>
        //     ? Schema.Schema.Type<IPv4.IPv4>
        //     : _Family extends Schema.Schema.Type<IPv6.IPv6Family>
        //       ? Schema.Schema.Type<IPv6.IPv6>
        //       : never {
        //     return this.onFamily({
        //         onIPv4: (self) =>
        //             Schema.decodeSync(IPv4.IPv4)(Schema.encodeSync(IPv4.IPv4Bigint)(self.networkAddressAsBigint)),
        //         onIPv6: (self) =>
        //             Schema.decodeSync(IPv6.IPv6)(Schema.encodeSync(IPv6.IPv6Bigint)(self.networkAddressAsBigint)),
        //     });
        // }
        // /**
        //  * The last address in the range given by this address' subnet, often
        //  * referred to as the Broadcast Address.
        //  *
        //  * @since 1.0.0
        //  */
        // public get broadcastAddressAsBigint(): _Family extends Schema.Schema.Type<IPv4.IPv4Family>
        //     ? Schema.Schema.Type<IPv4.IPv4Bigint>
        //     : _Family extends Schema.Schema.Type<IPv6.IPv6Family>
        //       ? Schema.Schema.Type<IPv6.IPv6Bigint>
        //       : never {
        //     const bits = this.address.family === "ipv4" ? 32 : 128;
        //     const bigIntegerAddress = this.onFamily({
        //         onIPv4: (self) => Schema.decodeSync(IPv4.IPv4Bigint)(self.address.ip),
        //         onIPv6: (self) => Schema.decodeSync(IPv6.IPv6Bigint)(self.address.ip),
        //     });
        //     const intermediate = bigIntegerAddress.value.toString(2).padStart(bits, "0").slice(0, this.mask);
        //     const broadcastAddressString = intermediate + "1".repeat(bits - this.mask);
        //     const broadcastAddressBigInt = BigInt(`0b${broadcastAddressString}`);
        //     return this.onFamily({
        //         onIPv4: (self) => ({
        //             family: self.address.family,
        //             value: IPv4.IPv4Bigint.to["fields"]["value"].make(broadcastAddressBigInt),
        //         }),
        //         onIPv6: (self) => ({
        //             family: self.address.family,
        //             value: IPv6.IPv6Bigint.to["fields"]["value"].make(broadcastAddressBigInt),
        //         }),
        //     });
        // }
        // /**
        //  * The last address in the range given by this address' subnet, often
        //  * referred to as the Broadcast Address.
        //  *
        //  * @since 1.0.0
        //  */
        // public broadcastAddress(): _Family extends Schema.Schema.Type<IPv4.IPv4Family>
        //     ? Schema.Schema.Type<IPv4.IPv4>
        //     : _Family extends Schema.Schema.Type<IPv6.IPv6Family>
        //       ? Schema.Schema.Type<IPv6.IPv6>
        //       : never {
        //     return this.onFamily({
        //         onIPv4: (self) =>
        //             Schema.decodeSync(IPv4.IPv4)(Schema.encodeSync(IPv4.IPv4Bigint)(self.broadcastAddressAsBigint)),
        //         onIPv6: (self) =>
        //             Schema.decodeSync(IPv6.IPv6)(Schema.encodeSync(IPv6.IPv6Bigint)(self.broadcastAddressAsBigint)),
        //     });
        // }
        // /**
        //  * A stream of all addresses in the range given by this address' subnet.
        //  *
        //  * @since 1.0.0
        //  */
        // public get range(): _Family extends Schema.Schema.Type<IPv4.IPv4Family>
        //     ? Stream.Stream<Schema.Schema.Type<IPv4.IPv4>, ParseResult.ParseError, never>
        //     : _Family extends Schema.Schema.Type<IPv6.IPv6Family>
        //       ? Stream.Stream<Schema.Schema.Type<IPv6.IPv6>, ParseResult.ParseError, never>
        //       : never {
        //     return this.onFamily({
        //         onIPv4: (self) => {
        //             const { value: minValue } = self.networkAddressAsBigint;
        //             const { value: maxValue } = self.broadcastAddressAsBigint;
        //             return Function.pipe(
        //                 Stream.iterate(minValue, (x) => IPv4.IPv4Bigint.to["fields"]["value"].make(x + 1n)),
        //                 Stream.takeWhile((n) => n <= maxValue),
        //                 Stream.flatMap((value) => Schema.encode(IPv4.IPv4Bigint)({ value, family: "ipv4" })),
        //                 Stream.mapEffect(Schema.decode(IPv4.IPv4))
        //             );
        //         },
        //         onIPv6: (self) => {
        //             const { value: minValue } = self.networkAddressAsBigint;
        //             const { value: maxValue } = self.broadcastAddressAsBigint;
        //             return Function.pipe(
        //                 Stream.iterate(minValue, (x) => IPv6.IPv6Bigint.to["fields"]["value"].make(x + 1n)),
        //                 Stream.takeWhile((n) => n <= maxValue),
        //                 Stream.flatMap((value) => Schema.encode(IPv6.IPv6Bigint)({ value, family: "ipv6" })),
        //                 Stream.mapEffect(Schema.decode(IPv6.IPv6))
        //             );
        //         },
        //     });
        // }
        // /**
        //  * The total number of addresses in the range given by this address'
        //  * subnet.
        //  *
        //  * @since 1.0.0
        //  */
        // public get total(): bigint {
        //     const minValue: bigint = this.networkAddressAsBigint.value;
        //     const maxValue: bigint = this.broadcastAddressAsBigint.value;
        //     return maxValue - minValue + 1n;
        // }
        // /**
        //  * Finds the smallest CIDR block that contains all the given IP
        //  * addresses.
        //  *
        //  * @since 1.0.0
        //  */
        // public static readonly cidrBlockForRange = <_Family extends Family.Family>(
        //     inputs: _Family extends Schema.Schema.Type<IPv4.IPv4Family>
        //         ? Array.NonEmptyReadonlyArray<Schema.Schema.Type<IPv4.IPv4>>
        //         : Array.NonEmptyReadonlyArray<Schema.Schema.Type<IPv6.IPv6>>
        // ): _Family extends Schema.Schema.Type<IPv4.IPv4Family>
        //     ? Effect.Effect<CidrBlockMixin<"ipv4">, ParseResult.ParseError, never>
        //     : Effect.Effect<CidrBlockMixin<"ipv6">, ParseResult.ParseError, never> =>
        //     Effect.gen(function* () {
        //         const AddressBigintOrder = Order.make(
        //             (a: Schema.Schema.Type<Address.AddressBigint>, b: Schema.Schema.Type<Address.AddressBigint>) => {
        //                 if (a.value < b.value) {
        //                     return -1;
        //                 } else if (a.value > b.value) {
        //                     return 1;
        //                 } else {
        //                     return 0;
        //                 }
        //             }
        //         );
        //         const heterogenousInputs = inputs as Array.NonEmptyReadonlyArray<Schema.Schema.Type<Address.Address>>;
        //         const bigints = Array.map(heterogenousInputs, (address) =>
        //             address.family === "ipv4"
        //                 ? Schema.decodeSync(IPv4.IPv4Bigint)(address.ip)
        //                 : Schema.decodeSync(IPv6.IPv6Bigint)(address.ip)
        //         );
        //         const bits = heterogenousInputs[0].family === "ipv4" ? 32 : 128;
        //         const min = Array.min(AddressBigintOrder)(bigints);
        //         const max = Array.max(AddressBigintOrder)(bigints);
        //         const leadingZerosInMin = bits - min.value.toString(2).length;
        //         const leadingZerosInMax = bits - max.value.toString(2).length;
        //         // const cidrMask = IPv4.IPv4Bigint.to["fields"]["value"].make(
        //         //     BigInt(Math.min(leadingZerosInMin, leadingZerosInMax))
        //         // );
        //         return new CidrBlockMixin<"ipv4" | "ipv6">(min as any, cidrMask);
        //         // return Schema.decode(CidrBlock)({ address: cidrAddress, mask: cidrMask });
        //         // return yield* Schema.decode(CidrBlockFromString)(`${cidrAddress}/${cidrMask}`);
        //     }) as _Family extends Schema.Schema.Type<IPv4.IPv4Family>
        //         ? Effect.Effect<CidrBlockMixin<"ipv4">, ParseResult.ParseError, never>
        //         : Effect.Effect<CidrBlockMixin<"ipv6">, ParseResult.ParseError, never>;
    };

    return klass;
}

// export class CidrBlockBase<const _Family extends Schema.Schema.Type<Family.Family>> extends Schema.Class<
//     CidrBlockBase<Schema.Schema.Type<Family.Family>>
// >("CidrBlockBase")({
//     address: Address.Address,
//     mask: Schema.Union(CidrBlockMask.IPv4CidrMask, CidrBlockMask.IPv6CidrMask),
// }) {

// }

class B extends Schema.Class<B>("B")({ address: IPv4.IPv4, mask: CidrBlockMask.IPv4CidrMask }) {
    public b() {
        return this.address;
    }
}

export class A extends CidrBlockMixin(B) {
    public a() {
        return this.address;
    }
}

/**
 * @since 1.0.0
 * @category Schemas
 */
export class IPv4CidrBlock extends Schema.transformOrFail(
    Schema.Struct({ address: IPv4.IPv4, mask: CidrBlockMask.IPv4CidrMask }),
    A,
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
}) {}

/**
 * A schema that transforms a `string` into a `CidrBlock`.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class IPv4CidrBlockFromString extends Schema.transform(
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
}) {}

/**
 * @since 1.0.0
 * @category Schemas
 */
export class IPv6CidrBlock extends Schema.transformOrFail(
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
}) {}

/**
 * A schema that transforms a `string` into a `CidrBlock`.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class IPv6CidrBlockFromString extends Schema.transform(
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
}) {}

/**
 * @since 1.0.0
 * @category Schemas
 */
export class CidrBlock extends Schema.Union(IPv4CidrBlock, IPv6CidrBlock) {}

/**
 * A schema that transforms a `string` into a `CidrBlock`.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class CidrBlockFromString extends Schema.transform(
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
}) {}
