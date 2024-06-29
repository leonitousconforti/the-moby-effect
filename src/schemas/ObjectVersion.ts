import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

/**
 * The version number of the object such as node, service, etc. This is needed
 * to avoid conflicting writes. The client must send the version number along
 * with the modified specification when updating these objects.
 *
 * This approach ensures safe concurrency and determinism in that the change on
 * the object may not be applied if the version number has changed from the last
 * read. In other words, if two update requests specify the same base version,
 * only one of the requests can succeed. As a result, two separate update
 * requests that happen at the same time will not unintentionally overwrite each
 * other.
 */
export const ObjectVersion = S.Struct({
    Index: S.optional(pipe(S.Number, S.int())),
});

export type ObjectVersion = S.Schema.Type<typeof ObjectVersion>;
export const ObjectVersionEncoded = S.encodedSchema(ObjectVersion);
export type ObjectVersionEncoded = S.Schema.Encoded<typeof ObjectVersion>;
