/**
 * 16bit signed integer schema.
 *
 * @since 1.0.0
 */

import * as Function from "effect/Function";
import * as Schema from "effect/Schema";

/**
 * 16bit signed integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class Int16 extends Function.pipe(
    Schema.Int,
    Schema.greaterThanOrEqualTo(-(2 ** 15)),
    Schema.lessThanOrEqualTo(2 ** 15 - 1),
    Schema.brand("Int16"),
    Schema.annotations({
        identifier: "Int16",
        title: "16-bit signed integer",
        description: "A 16-bit signed integer.",
    })
) {}
