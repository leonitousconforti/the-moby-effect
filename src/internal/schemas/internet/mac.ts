/**
 * Mac Address schema.
 *
 * @since 1.0.0
 */

import * as Function from "effect/Function";
import * as Schema from "effect/Schema";

/**
 * @since 1.0.0
 * @category Regular expressions
 * @see https://stackoverflow.com/questions/4260467/what-is-a-regular-expression-for-a-mac-address
 */
export const MacAddressRegex = new RegExp("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$");

/**
 * A Mac Address.
 *
 * @since 1.0.0
 * @category Schemas
 */
export class MacAddress extends Function.pipe(
    Schema.String,
    Schema.pattern(MacAddressRegex),
    Schema.brand("MacAddress"),
    Schema.annotations({
        identifier: "MacAddress",
        title: "A MacAddress",
        description: "A network interface's MacAddress",
    })
) {}
