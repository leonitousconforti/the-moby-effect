/**
 * 16bit unsigned integer schema.
 *
 * @since 1.0.0
 */

import * as Function from "effect/Function";
import * as Schema from "effect/Schema";

/**
 * 16bit unsigned integer.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class UInt16 extends Function.pipe(
    Schema.Int,
    Schema.greaterThanOrEqualTo(0),
    Schema.lessThanOrEqualTo(2 ** 16 - 1),
    Schema.brand("UInt16"),
    Schema.annotations({
        identifier: "UInt16",
        title: "16-bit unsigned integer",
        description: "A 16-bit unsigned integer.",
    })
) {}
