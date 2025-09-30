/**
 * 32bit unsigned integer schema.
 *
 * @since 1.0.0
 */

import * as Function from "effect/Function";
import * as Schema from "effect/Schema";

/**
 * 32bit unsigned integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class UInt32 extends Function.pipe(
    Schema.Int,
    Schema.greaterThanOrEqualTo(0),
    Schema.lessThanOrEqualTo(2 ** 32 - 1),
    Schema.brand("UInt32"),
    Schema.annotations({
        identifier: "UInt32",
        title: "32-bit unsigned integer",
        description: "A 32-bit unsigned integer.",
    })
) {}
