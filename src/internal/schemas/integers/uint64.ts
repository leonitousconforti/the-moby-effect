/**
 * 64bit unsigned integer schema.
 *
 * @since 1.0.0
 */

import * as Function from "effect/Function";
import * as Schema from "effect/Schema";

/**
 * 64bit unsigned integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class UInt64 extends Function.pipe(
    Schema.Number,
    Schema.greaterThanOrEqualTo(0),
    Schema.lessThanOrEqualTo(2 ** 64 - 1),
    Schema.brand("UInt64"),
    Schema.annotations({
        identifier: "UInt64",
        title: "64-bit unsigned integer",
        description: "A 64-bit unsigned integer.",
    })
) {}
