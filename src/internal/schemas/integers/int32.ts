/**
 * 32bit signed integer schema.
 *
 * @since 1.0.0
 */

import * as Function from "effect/Function";
import * as Schema from "effect/Schema";

/**
 * 32bit signed integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class Int32 extends Function.pipe(
    Schema.Int,
    Schema.greaterThanOrEqualTo(-(2 ** 31)),
    Schema.lessThanOrEqualTo(2 ** 31 - 1),
    Schema.brand("Int32"),
    Schema.annotations({
        identifier: "Int32",
        title: "32-bit signed integer",
        description: "A 32-bit signed integer.",
    })
) {}
