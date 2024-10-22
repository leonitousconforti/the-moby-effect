/**
 * 8bit signed integer schema.
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
export type Int8Brand = number & Brand.Brand<"Int8">;

/**
 * @since 1.0.0
 * @category Branded constructors
 */
export const Int8Brand: Brand.Brand.Constructor<Int8Brand> = Brand.nominal<Int8Brand>();

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $Int8 extends Schema.Annotable<$Int8, Int8Brand, Brand.Brand.Unbranded<Int8Brand>, never> {}

/**
 * 8bit signed integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const Int8: $Int8 = Function.pipe(
    Schema.Int,
    Schema.greaterThanOrEqualTo(-(2 ** 7)),
    Schema.lessThanOrEqualTo(2 ** 7 - 1),
    Schema.fromBrand(Int8Brand),
    Schema.annotations({
        identifier: "Int8",
        title: "8-bit signed integer",
        description: "An 8-bit signed integer.",
    })
);
