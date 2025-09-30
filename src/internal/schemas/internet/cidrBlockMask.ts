/**
 * IPv4 and IPv4 CidrBlock mask schemas.
 *
 * @since 1.0.0
 */

import * as Schema from "effect/Schema";

/**
 * An ipv4 cidr mask, which is a number between 0 and 32.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     import * as Schema from "effect/Schema";
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
export class IPv4CidrMask extends Schema.Int.pipe(Schema.between(0, 32))
    .pipe(Schema.brand("IPv4CidrMask"))
    .annotations({
        identifier: "IPv4CidrMask",
        description: "An ipv4 cidr mask",
    }) {}

/**
 * An ipv6 cidr mask, which is a number between 0 and 128.
 *
 * @since 1.0.0
 * @category Schemas
 * @example
 *     import * as Schema from "effect/Schema";
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
export class IPv6CidrMask extends Schema.Int.pipe(Schema.between(0, 128))
    .pipe(Schema.brand("IPv6CidrMask"))
    .annotations({
        identifier: "IPv6CidrMask",
        description: "An ipv6 cidr mask",
    }) {}
