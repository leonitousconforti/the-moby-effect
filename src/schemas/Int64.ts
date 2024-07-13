import * as Schema from "@effect/schema/Schema";
import * as Brand from "effect/Brand";
import * as Function from "effect/Function";

/**
 * @since 1.0.0
 * @category Branded types
 */
export type Int64Brand = number & Brand.Brand<"Int64">;

/**
 * @since 1.0.0
 * @category Branded constructors
 */
export const Int64Brand: Brand.Brand.Constructor<Int64Brand> = Brand.nominal<Int64Brand>();

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $Int64 extends Schema.Annotable<$Int64, Int64Brand, Brand.Brand.Unbranded<Int64Brand>, never> {}

/**
 * 8bit signed integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const Int64: $Int64 = Function.pipe(
    Schema.Int,
    Schema.greaterThanOrEqualTo(-(2 ** 63)),
    Schema.lessThanOrEqualTo(2 ** 63 - 1),
    Schema.fromBrand(Int64Brand),
    Schema.annotations({
        identifier: "Int64",
        title: "64-bit signed integer",
        description: "A 64-bit signed integer.",
    })
);
