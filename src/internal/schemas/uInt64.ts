/**
 * 64bit unsigned integer schema.
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
export type UInt64Brand = number & Brand.Brand<"UInt64">;

/**
 * @since 1.0.0
 * @category Branded constructors
 */
export const UInt64Brand: Brand.Brand.Constructor<UInt64Brand> = Brand.nominal<UInt64Brand>();

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $UInt64 extends Schema.Annotable<$UInt64, UInt64Brand, Brand.Brand.Unbranded<UInt64Brand>, never> {}

/**
 * 64bit unsigned integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const UInt64: $UInt64 = Function.pipe(
    Schema.Number,
    Schema.greaterThanOrEqualTo(0),
    Schema.lessThanOrEqualTo(2 ** 64 - 1),
    Schema.fromBrand(UInt64Brand),
    Schema.annotations({
        identifier: "UInt64",
        title: "64-bit unsigned integer",
        description: "A 64-bit unsigned integer.",
    })
);
