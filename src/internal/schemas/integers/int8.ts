/**
 * 8bit signed integer schema.
 *
 * @since 1.0.0
 */

import * as Function from "effect/Function";
import * as Schema from "effect/Schema";

/**
 * 8bit signed integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class Int8 extends Function.pipe(
    Schema.Int,
    Schema.greaterThanOrEqualTo(-(2 ** 7)),
    Schema.lessThanOrEqualTo(2 ** 7 - 1),
    Schema.brand("Int8"),
    Schema.annotations({
        identifier: "Int8",
        title: "8-bit signed integer",
        description: "An 8-bit signed integer.",
    })
) {}
