/**
 * Mac Address schema.
 *
 * @since 1.0.0
 */

import * as Brand from "effect/Brand";
import * as Function from "effect/Function";
import * as Schema from "effect/Schema";

/**
 * @since 1.0.0
 * @category Regular expressions
 * @see https://stackoverflow.com/questions/4260467/what-is-a-regular-expression-for-a-mac-address
 */
export const MacAddressRegex = new RegExp("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$");

/**
 * @since 1.0.0
 * @category Branded types
 */
export type MacAddressBrand = string & Brand.Brand<"MacAddress">;

/**
 * @since 1.0.0
 * @category Branded constructors
 */
export const MacAddressBrand = Brand.nominal<MacAddressBrand>();

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface MacAddress
    extends Schema.Annotable<MacAddress, MacAddressBrand, Brand.Brand.Unbranded<MacAddressBrand>, never> {}

/**
 * A Mac Address.
 *
 * @since 1.0.0
 * @category Schemas
 */
export const MacAddress: MacAddress = Function.pipe(
    Schema.String,
    Schema.pattern(MacAddressRegex),
    Schema.fromBrand(MacAddressBrand),
    Schema.annotations({
        identifier: "MacAddress",
        title: "A MacAddress",
        description: "A network interface's MacAddress",
    })
);
