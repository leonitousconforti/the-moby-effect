import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

/**
 * A descriptor struct containing digest, media type, and size, as defined in
 * the [OCI Content Descriptors
 * Specification](https://github.com/opencontainers/image-spec/blob/v1.0.1/descriptor.md).
 */
export const OCIDescriptor = S.Struct({
    /** The media type of the object this schema refers to. */
    mediaType: S.optional(S.String),
    /** The digest of the targeted content. */
    digest: S.optional(S.String),
    /** The size in bytes of the blob. */
    size: S.optional(pipe(S.Number, S.int())),
});

export type OCIDescriptor = S.Schema.Type<typeof OCIDescriptor>;
export const OCIDescriptorEncoded = S.encodedSchema(OCIDescriptor);
export type OCIDescriptorEncoded = S.Schema.Encoded<typeof OCIDescriptor>;
