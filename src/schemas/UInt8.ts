import * as Schema from "@effect/schema/Schema";
import * as Brand from "effect/Brand";
import * as Function from "effect/Function";

/**
 * @since 1.0.0
 * @category Branded types
 */
export type UInt8Brand = number & Brand.Brand<"UInt8">;

/**
 * @since 1.0.0
 * @category Branded constructors
 */
export const UInt8Brand: Brand.Brand.Constructor<UInt8Brand> = Brand.nominal<UInt8Brand>();

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $UInt8 extends Schema.Annotable<$UInt8, UInt8Brand, Brand.Brand.Unbranded<UInt8Brand>, never> {}

/**
 * 8bit unsigned integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const UInt8: $UInt8 = Function.pipe(
    Schema.Int,
    Schema.greaterThanOrEqualTo(0),
    Schema.lessThanOrEqualTo(2 ** 8 - 1),
    Schema.fromBrand(UInt8Brand),
    Schema.annotations({
        identifier: "UInt8",
        title: "8-bit unsigned integer",
        description: "An 8-bit unsigned integer.",
    })
);
