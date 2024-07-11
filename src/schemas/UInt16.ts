import * as Schema from "@effect/schema/Schema";
import * as Brand from "effect/Brand";
import * as Function from "effect/Function";

/**
 * @since 1.0.0
 * @category Branded types
 */
export type UInt16Brand = number & Brand.Brand<"UInt16">;

/**
 * @since 1.0.0
 * @category Branded constructors
 */
export const UInt16Brand = Brand.nominal<UInt16Brand>();

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $UInt16 extends Schema.Annotable<$UInt16, UInt16Brand, Brand.Brand.Unbranded<UInt16Brand>, never> {}

/**
 * 8bit signed integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const UInt16: $UInt16 = Function.pipe(
    Schema.Int,
    Schema.greaterThanOrEqualTo(0),
    Schema.lessThanOrEqualTo(2 ** 16 - 1),
    Schema.fromBrand(UInt16Brand),
    Schema.annotations({
        identifier: "UInt16",
        title: "16-bit unsigned integer",
        description: "A 16-bit unsigned integer.",
    })
);
