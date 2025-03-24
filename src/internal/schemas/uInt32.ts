/**
 * 32bit unsigned integer schema.
 *
 * @since 1.0.0
 */

import * as Brand from "effect/Brand";
import * as Function from "effect/Function";
import * as Schema from "effect/Schema";

/**
 * @since 1.0.0
 * @category Branded types
 */
export type UInt32Brand = number & Brand.Brand<"UInt32">;

/**
 * @since 1.0.0
 * @category Branded constructors
 */
export const UInt32Brand: Brand.Brand.Constructor<UInt32Brand> = Brand.nominal<UInt32Brand>();

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $UInt32 extends Schema.Annotable<$UInt32, UInt32Brand, Brand.Brand.Unbranded<UInt32Brand>, never> {}

/**
 * 32bit unsigned integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const UInt32: $UInt32 = Function.pipe(
    Schema.Int,
    Schema.greaterThanOrEqualTo(0),
    Schema.lessThanOrEqualTo(2 ** 32 - 1),
    Schema.fromBrand(UInt32Brand),
    Schema.annotations({
        identifier: "UInt32",
        title: "32-bit unsigned integer",
        description: "A 32-bit unsigned integer.",
    })
);
