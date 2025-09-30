/**
 * 64bit signed integer schema.
 *
 * @since 1.0.0
 */

import * as Function from "effect/Function";
import * as Schema from "effect/Schema";

/**
 * 64bit signed integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class Int64 extends Function.pipe(
    Schema.Number,
    Schema.greaterThanOrEqualTo(-(2 ** 63)),
    Schema.lessThanOrEqualTo(2 ** 63 - 1),
    Schema.brand("Int64"),
    Schema.annotations({
        identifier: "Int64",
        title: "64-bit signed integer",
        description: "A 64-bit signed integer.",
    })
) {}
