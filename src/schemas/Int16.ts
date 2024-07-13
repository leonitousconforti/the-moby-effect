import * as Schema from "@effect/schema/Schema";
import * as Brand from "effect/Brand";
import * as Function from "effect/Function";

/**
 * @since 1.0.0
 * @category Branded types
 */
export type Int16Brand = number & Brand.Brand<"Int16">;

/**
 * @since 1.0.0
 * @category Branded constructors
 */
export const Int16Brand: Brand.Brand.Constructor<Int16Brand> = Brand.nominal<Int16Brand>();

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $Int16 extends Schema.Annotable<$Int16, Int16Brand, Brand.Brand.Unbranded<Int16Brand>, never> {}

/**
 * 8bit signed integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const Int16: $Int16 = Function.pipe(
    Schema.Int,
    Schema.greaterThanOrEqualTo(-(2 ** 15)),
    Schema.lessThanOrEqualTo(2 ** 15 - 1),
    Schema.fromBrand(Int16Brand),
    Schema.annotations({
        identifier: "Int16",
        title: "16-bit signed integer",
        description: "A 16-bit signed integer.",
    })
);
