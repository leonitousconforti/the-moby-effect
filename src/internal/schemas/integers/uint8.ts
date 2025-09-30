/**
 * 8bit unsigned integer schema.
 *
 * @since 1.0.0
 */

import * as Function from "effect/Function";
import * as Schema from "effect/Schema";

/**
 * 8bit unsigned integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class UInt8 extends Function.pipe(
    Schema.Int,
    Schema.greaterThanOrEqualTo(0),
    Schema.lessThanOrEqualTo(2 ** 8 - 1),
    Schema.brand("UInt8"),
    Schema.annotations({
        identifier: "UInt8",
        title: "8-bit unsigned integer",
        description: "An 8-bit unsigned integer.",
    })
) {}
