/**
 * IPv4 or IPv6 cidr block schemas.
 *
 * @since 1.0.0
 */

import type * as ParseResult from "effect/ParseResult";
import type * as Address from "./address.ts";

import * as Array from "effect/Array";
import * as Function from "effect/Function";
import * as Order from "effect/Order";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";

import * as CidrBlockMask from "./cidrBlockMask.ts";
import * as IPv4 from "./ipv4.ts";
import * as IPv6 from "./ipv6.ts";

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

/** @internal */
export const onFamily = Function.dual<
    <OnIPv4, OnIPv6>({
        onIPv4,
        onIPv6,
    }: {
        onIPv4: (self: IPv4CidrBlock) => OnIPv4;
        onIPv6: (self: IPv6CidrBlock) => OnIPv6;
    }) => <Input extends IPv4CidrBlock | IPv6CidrBlock>(
        input: Input
    ) => Input extends IPv4CidrBlock ? OnIPv4 : Input extends IPv6CidrBlock ? OnIPv6 : never,
    <Input extends IPv4CidrBlock | IPv6CidrBlock, OnIPv4, OnIPv6>(
        input: Input,
        {
            onIPv4,
            onIPv6,
        }: {
            onIPv4: (self: IPv4CidrBlock) => OnIPv4;
            onIPv6: (self: IPv6CidrBlock) => OnIPv6;
        }
    ) => Input extends IPv4CidrBlock ? OnIPv4 : Input extends IPv6CidrBlock ? OnIPv6 : never
>(
    2,
    <Input extends IPv4CidrBlock | IPv6CidrBlock, OnIPv4, OnIPv6>(
        input: Input,
        {
            onIPv4,
            onIPv6,
        }: {
            onIPv4: (self: IPv4CidrBlock) => OnIPv4;
            onIPv6: (self: IPv6CidrBlock) => OnIPv6;
        }
    ): Input extends IPv4CidrBlock ? OnIPv4 : Input extends IPv6CidrBlock ? OnIPv6 : never => {
        switch (input.address.family) {
            case "ipv4":
                return onIPv4(input as any) as any;
            case "ipv6":
                return onIPv6(input as any) as any;
            default:
                return Function.absurd<any>(input.address);
        }
    }
);

/**
 * The first address in the range given by this address' subnet, often referred
 * to as the Network Address.
 *
 * @since 1.0.0
 */
export const networkAddressAsBigint = <Input extends IPv4CidrBlock | IPv6CidrBlock>(
    input: Input
): Input extends IPv4CidrBlock
    ? Schema.Schema.Type<IPv4.IPv4Bigint>
    : Input extends IPv6CidrBlock
      ? Schema.Schema.Type<IPv6.IPv6Bigint>
      : never => {
    const bits = input.address.family === "ipv4" ? 32 : 128;
    const { value: bigIntegerAddress } = onFamily(input, {
        onIPv4: (self) => Schema.decodeSync(IPv4.IPv4Bigint)(self.address.ip),
        onIPv6: (self) => Schema.decodeSync(IPv6.IPv6Bigint)(self.address.ip),
    });
    const intermediate = bigIntegerAddress.toString(2).padStart(bits, "0").slice(0, input.mask);
    const networkAddressString = intermediate + "0".repeat(bits - input.mask);
    const networkAddressBigint = BigInt(`0b${networkAddressString}`);
    return onFamily(input, {
        onIPv4: (self) => ({
            family: self.address.family,
            value: IPv4.IPv4Bigint.to["fields"]["value"].make(networkAddressBigint),
        }),
        onIPv6: (self) => ({
            family: self.address.family,
            value: IPv6.IPv6Bigint.to["fields"]["value"].make(networkAddressBigint),
        }),
    });
};

/**
 * The first address in the range given by this address' subnet, often referred
 * to as the Network Address.
 *
 * @since 1.0.0
 */
export const networkAddress: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
    input: Input
) => Input extends IPv4CidrBlock
    ? Schema.Schema.Type<IPv4.IPv4>
    : Input extends IPv6CidrBlock
      ? Schema.Schema.Type<IPv6.IPv6>
      : never = onFamily({
    onIPv4: (self) => Schema.decodeSync(IPv4.IPv4)(Schema.encodeSync(IPv4.IPv4Bigint)(networkAddressAsBigint(self))),
    onIPv6: (self) => Schema.decodeSync(IPv6.IPv6)(Schema.encodeSync(IPv6.IPv6Bigint)(networkAddressAsBigint(self))),
});

/**
 * The last address in the range given by this address' subnet, often referred
 * to as the Broadcast Address.
 *
 * @since 1.0.0
 */
export const broadcastAddressAsBigint = <Input extends IPv4CidrBlock | IPv6CidrBlock>(
    input: Input
): Input extends IPv4CidrBlock
    ? Schema.Schema.Type<IPv4.IPv4Bigint>
    : Input extends IPv6CidrBlock
      ? Schema.Schema.Type<IPv6.IPv6Bigint>
      : never => {
    const bits = input.address.family === "ipv4" ? 32 : 128;
    const { value: bigIntegerAddress } = onFamily(input, {
        onIPv4: (self) => Schema.decodeSync(IPv4.IPv4Bigint)(self.address.ip),
        onIPv6: (self) => Schema.decodeSync(IPv6.IPv6Bigint)(self.address.ip),
    });
    const intermediate = bigIntegerAddress.toString(2).padStart(bits, "0").slice(0, input.mask);
    const broadcastAddressString = intermediate + "1".repeat(bits - input.mask);
    const broadcastAddressBigInt = BigInt(`0b${broadcastAddressString}`);
    return onFamily(input, {
        onIPv4: (self) => ({
            family: self.address.family,
            value: IPv4.IPv4Bigint.to["fields"]["value"].make(broadcastAddressBigInt),
        }),
        onIPv6: (self) => ({
            family: self.address.family,
            value: IPv6.IPv6Bigint.to["fields"]["value"].make(broadcastAddressBigInt),
        }),
    });
};

/**
 * The last address in the range given by this address' subnet, often referred
 * to as the Broadcast Address.
 *
 * @since 1.0.0
 */
export const broadcastAddress: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
    input: Input
) => Input extends IPv4CidrBlock
    ? Schema.Schema.Type<IPv4.IPv4>
    : Input extends IPv6CidrBlock
      ? Schema.Schema.Type<IPv6.IPv6>
      : never = onFamily({
    onIPv4: (self) => Schema.decodeSync(IPv4.IPv4)(Schema.encodeSync(IPv4.IPv4Bigint)(broadcastAddressAsBigint(self))),
    onIPv6: (self) => Schema.decodeSync(IPv6.IPv6)(Schema.encodeSync(IPv6.IPv6Bigint)(broadcastAddressAsBigint(self))),
});

/**
 * A stream of all addresses in the range given by this address' subnet.
 *
 * @since 1.0.0
 */
export const range: <Input extends IPv4CidrBlock | IPv6CidrBlock>(
    input: Input
) => Input extends IPv4CidrBlock
    ? Stream.Stream<Schema.Schema.Type<IPv4.IPv4>, ParseResult.ParseError, never>
    : Input extends IPv6CidrBlock
      ? Stream.Stream<Schema.Schema.Type<IPv6.IPv6>, ParseResult.ParseError, never>
      : never = onFamily({
    onIPv4: (self) => {
        const { value: minValue } = networkAddressAsBigint(self);
        const { value: maxValue } = broadcastAddressAsBigint(self);
        return Function.pipe(
            Stream.iterate(minValue, (x) => IPv4.IPv4Bigint.to["fields"]["value"].make(x + 1n)),
            Stream.takeWhile((n) => n <= maxValue),
            Stream.flatMap((value) => Schema.encode(IPv4.IPv4Bigint)({ value, family: "ipv4" })),
            Stream.mapEffect(Schema.decode(IPv4.IPv4))
        );
    },
    onIPv6: (self) => {
        const { value: minValue } = networkAddressAsBigint(self);
        const { value: maxValue } = broadcastAddressAsBigint(self);
        return Function.pipe(
            Stream.iterate(minValue, (x) => IPv6.IPv6Bigint.to["fields"]["value"].make(x + 1n)),
            Stream.takeWhile((n) => n <= maxValue),
            Stream.flatMap((value) => Schema.encode(IPv6.IPv6Bigint)({ value, family: "ipv6" })),
            Stream.mapEffect(Schema.decode(IPv6.IPv6))
        );
    },
});

/**
 * The total number of addresses in the range given by this address' subnet.
 *
 * @since 1.0.0
 */
export const total = (input: IPv4CidrBlock | IPv6CidrBlock): bigint => {
    const minValue: bigint = networkAddressAsBigint(input).value;
    const maxValue: bigint = broadcastAddressAsBigint(input).value;
    return maxValue - minValue + 1n;
};

/**
 * Finds the smallest CIDR block that contains all the given IP addresses.
 *
 * @since 1.0.0
 */
export const cidrBlockForRange = <
    Input extends
        | Array.NonEmptyReadonlyArray<Schema.Schema.Type<IPv4.IPv4>>
        | Array.NonEmptyReadonlyArray<Schema.Schema.Type<IPv6.IPv6>>,
>(
    inputs: Input
) => {
    const AddressBigintOrder = Order.make(
        (a: Schema.Schema.Type<Address.AddressBigint>, b: Schema.Schema.Type<Address.AddressBigint>) => {
            if (a.value < b.value) {
                return -1;
            } else if (a.value > b.value) {
                return 1;
            } else {
                return 0;
            }
        }
    );

    const heterogenousInputs = inputs as Array.NonEmptyReadonlyArray<Schema.Schema.Type<Address.Address>>;
    const bigints = Array.map(heterogenousInputs, (address) =>
        address.family === "ipv4"
            ? Schema.decodeSync(IPv4.IPv4Bigint)(address.ip)
            : Schema.decodeSync(IPv6.IPv6Bigint)(address.ip)
    );

    const bits = heterogenousInputs[0].family === "ipv4" ? 32 : 128;
    const min = Array.min(AddressBigintOrder)(bigints);
    const max = Array.max(AddressBigintOrder)(bigints);
    const leadingZerosInMin = bits - min.value.toString(2).length;
    const leadingZerosInMax = bits - max.value.toString(2).length;
    const leadingMin = Math.min(leadingZerosInMin, leadingZerosInMax);

    const address =
        min.family === "ipv4" ? Schema.encodeSync(IPv4.IPv4Bigint)(min) : Schema.encodeSync(IPv6.IPv6Bigint)(min);

    return Schema.decodeSync(CidrBlock)({
        address,
        mask: leadingMin,
    });
};

/**
 * @since 1.0.0
 * @category Schemas
 */
export class IPv4CidrBlock extends Schema.Class<IPv4CidrBlock>("IPv4CidrBlock")(
    {
        address: IPv4.IPv4,
        mask: CidrBlockMask.IPv4CidrMask,
    },
    {
        identifier: "IPv4CidrBlock",
        description: "An ipv4 cidr block",
    }
) {
    /**
     * The first address in the range given by this address' subnet, often
     * referred to as the Network Address.
     *
     * @since 1.0.0
     */
    public networkAddressAsBigint = networkAddressAsBigint(this);

    /**
     * The first address in the range given by this address' subnet, often
     * referred to as the Network Address.
     *
     * @since 1.0.0
     */
    public networkAddress = networkAddress(this);

    /**
     * The last address in the range given by this address' subnet, often
     * referred to as the Broadcast Address.
     *
     * @since 1.0.0
     */
    public broadcastAddressAsBigint = broadcastAddressAsBigint(this);

    /**
     * The last address in the range given by this address' subnet, often
     * referred to as the Broadcast Address.
     *
     * @since 1.0.0
     */
    public broadcastAddress = broadcastAddress(this);

    /**
     * A stream of all addresses in the range given by this address' subnet.
     *
     * @since 1.0.0
     */
    public range = range(this);

    /**
     * The total number of addresses in the range given by this address' subnet.
     *
     * @since 1.0.0
     */
    public total = total(this);
}

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
export class IPv6CidrBlock extends Schema.Class<IPv6CidrBlock>("IPv6CidrBlock")(
    {
        address: IPv6.IPv6,
        mask: CidrBlockMask.IPv6CidrMask,
    },
    {
        identifier: "IPv6CidrBlock",
        description: "An ipv6 cidr block",
    }
) {
    /**
     * The first address in the range given by this address' subnet, often
     * referred to as the Network Address.
     *
     * @since 1.0.0
     */
    public networkAddressAsBigint: Schema.Schema.Type<IPv6.IPv6Bigint> = networkAddressAsBigint(this);

    /**
     * The first address in the range given by this address' subnet, often
     * referred to as the Network Address.
     *
     * @since 1.0.0
     */
    public networkAddress = networkAddress(this);

    /**
     * The last address in the range given by this address' subnet, often
     * referred to as the Broadcast Address.
     *
     * @since 1.0.0
     */
    public broadcastAddressAsBigint = broadcastAddressAsBigint(this);

    /**
     * The last address in the range given by this address' subnet, often
     * referred to as the Broadcast Address.
     *
     * @since 1.0.0
     */
    public broadcastAddress = broadcastAddress(this);

    /**
     * A stream of all addresses in the range given by this address' subnet.
     *
     * @since 1.0.0
     */
    public range = range(this);

    /**
     * The total number of addresses in the range given by this address' subnet.
     *
     * @since 1.0.0
     */
    public total = total(this);
}

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
