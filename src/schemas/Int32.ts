/**
 * 32bit signed integer schema.
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
export type Int32Brand = number & Brand.Brand<"Int32">;

/**
 * @since 1.0.0
 * @category Branded constructors
 */
export const Int32Brand: Brand.Brand.Constructor<Int32Brand> = Brand.nominal<Int32Brand>();

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $Int32 extends Schema.Annotable<$Int32, Int32Brand, Brand.Brand.Unbranded<Int32Brand>, never> {}

/**
 * 32bit signed integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const Int32: $Int32 = Function.pipe(
    Schema.Int,
    Schema.greaterThanOrEqualTo(-(2 ** 31)),
    Schema.lessThanOrEqualTo(2 ** 31 - 1),
    Schema.fromBrand(Int32Brand),
    Schema.annotations({
        identifier: "Int32",
        title: "32-bit signed integer",
        description: "A 32-bit signed integer.",
    })
);
