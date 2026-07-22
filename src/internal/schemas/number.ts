/**
 * Number schemas for fields the Docker daemon sends and expects as bare JSON
 * numbers.
 *
 * @since 1.0.0
 */

import * as Schema from "effect/Schema";
import * as SchemaTransformation from "effect/SchemaTransformation";

/**
 * Marks a string as the wire form of a JSON number so the agnostic http client
 * can find it in a serialized request body and unquote it. The daemon sends
 * and expects bare JSON numbers for 64-bit fields, but bare numbers cannot be
 * decoded losslessly in JavaScript, so the agnostic http client quotes every
 * number in a response body ("replacer") and these schemas decode the quoted
 * strings. Encoding is the tricky direction: once a payload is serialized,
 * `{"Memory":"1024"}` (was a bigint, must be sent as 1024) is
 * indistinguishable from a genuine string field that happens to contain
 * digits. So encoding prefixes this sentinel - a Unicode private-use
 * character that `JSON.stringify` emits literally - and the agnostic http
 * client unquotes exactly the strings marked with it ("unreplacer"). Decoding
 * tolerates the sentinel so encoded payloads still round-trip.
 *
 * @internal
 */
export const wireNumberSentinel = "\uE000";

const sentinelTransformation = SchemaTransformation.transform({
    decode: (s: string) => (s.startsWith(wireNumberSentinel) ? s.slice(wireNumberSentinel.length) : s),
    encode: (s: string) => wireNumberSentinel + s,
});

/**
 * A number that crosses the wire as a bare JSON number but is carried as a
 * quoted string between the agnostic http client and this schema. See
 * {@link wireNumberSentinel} for how the two directions work.
 *
 * @internal
 */
export const NumberFromWireString = Schema.String.annotate({
    expected: "a string that will be decoded as a number and sent over the wire as a bare JSON number",
}).pipe(Schema.decodeTo(Schema.Number, sentinelTransformation.compose(SchemaTransformation.numberFromString)));

/**
 * A bigint that crosses the wire as a bare JSON number but is carried as a
 * quoted string between the agnostic http client and this schema. See
 * {@link wireNumberSentinel} for how the two directions work.
 *
 * @internal
 */
export const BigIntFromWireString = Schema.String.annotate({
    expected: "a string that will be decoded as a bigint and sent over the wire as a bare JSON number",
}).pipe(Schema.decodeTo(Schema.BigInt, sentinelTransformation.compose(SchemaTransformation.bigintFromString)));
