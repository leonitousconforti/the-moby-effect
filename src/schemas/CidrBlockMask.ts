/**
 * IPv4 and IPv4 CidrBlock mask schemas.
 *
 * @since 1.0.0
 */

import * as Schema from "@effect/schema/Schema";
import * as Brand from "effect/Brand";

/**
 * @since 1.0.0
 * @category Branded types
 */
export type IPv4CidrMaskBrand = number & Brand.Brand<"IPv4CidrMask">;

/**
 * @since 1.0.0
 * @category Branded constructors
 */
export const IPv4CidrMaskBrand = Brand.nominal<IPv4CidrMaskBrand>();

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $IPv4CidrMask
    extends Schema.Annotable<$IPv4CidrMask, IPv4CidrMaskBrand, Brand.Brand.Unbranded<IPv4CidrMaskBrand>, never> {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type IPv4CidrMask = Schema.Schema.Type<$IPv4CidrMask>;

/**
 * @since 1.0.0
 * @category Encoded types
 */
export type IPv4CidrMaskEncoded = Schema.Schema.Encoded<$IPv4CidrMask>;

/**
 * An ipv4 cidr mask, which is a number between 0 and 32.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     import * as Schema from "@effect/schema/Schema";
 *     import {
 *         IPv4CidrMask,
 *         IPv4CidrMaskBrand,
 *     } from "the-moby-effect/schemas/CidrBlockMask.js";
 *
 *     const mask: IPv4CidrMaskBrand = IPv4CidrMaskBrand(24);
 *     assert.strictEqual(mask, 24);
 *
 *     const decodeMask = Schema.decodeSync(IPv4CidrMask);
 *     assert.strictEqual(decodeMask(24), 24);
 *
 *     assert.throws(() => decodeMask(33));
 *     assert.doesNotThrow(() => decodeMask(0));
 *     assert.doesNotThrow(() => decodeMask(32));
 */
export const IPv4CidrMask: $IPv4CidrMask = Schema.Int.pipe(Schema.between(0, 32))
    .pipe(Schema.fromBrand(IPv4CidrMaskBrand))
    .annotations({
        identifier: "IPv4CidrMask",
        description: "An ipv4 cidr mask",
    });

/**
 * @since 1.0.0
 * @category Branded types
 */
export type IPv6CidrMaskBrand = number & Brand.Brand<"IPv6CidrMask">;

/**
 * @since 1.0.0
 * @category Branded constructors
 */
export const IPv6CidrMaskBrand = Brand.nominal<IPv6CidrMaskBrand>();

/**
 * @since 1.0.0
 * @category Api interface
 */
export interface $IPv6CidrMask
    extends Schema.Annotable<$IPv6CidrMask, IPv6CidrMaskBrand, Brand.Brand.Unbranded<IPv6CidrMaskBrand>, never> {}

/**
 * @since 1.0.0
 * @category Decoded types
 */
export type IPv6CidrMask = Schema.Schema.Type<$IPv6CidrMask>;

/**
 * @since 1.0.0
 * @category Encoded types
 */
export type IPv6CidrMaskEncoded = Schema.Schema.Encoded<$IPv6CidrMask>;

/**
 * An ipv6 cidr mask, which is a number between 0 and 128.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     import * as Schema from "@effect/schema/Schema";
 *     import {
 *         IPv6CidrMask,
 *         IPv6CidrMaskBrand,
 *     } from "the-moby-effect/schemas/CidrBlockMask.js";
 *
 *     const mask: IPv6CidrMaskBrand = IPv6CidrMaskBrand(64);
 *     assert.strictEqual(mask, 64);
 *
 *     const decodeMask = Schema.decodeSync(IPv6CidrMask);
 *     assert.strictEqual(decodeMask(64), 64);
 *
 *     assert.throws(() => decodeMask(129));
 *     assert.doesNotThrow(() => decodeMask(0));
 *     assert.doesNotThrow(() => decodeMask(128));
 */
export const IPv6CidrMask: $IPv6CidrMask = Schema.Int.pipe(Schema.between(0, 128))
    .pipe(Schema.fromBrand(IPv6CidrMaskBrand))
    .annotations({
        identifier: "IPv6CidrMask",
        description: "An ipv6 cidr mask",
    });
