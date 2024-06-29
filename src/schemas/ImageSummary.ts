import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

export const ImageSummary = S.Struct({
    /**
     * ID is the content-addressable ID of an image.
     *
     * This identifier is a content-addressable digest calculated from the
     * image's configuration (which includes the digests of layers used by the
     * image).
     *
     * Note that this digest differs from the `RepoDigests` below, which holds
     * digests of image manifests that reference the image.
     */
    Id: S.String,
    /**
     * ID of the parent image.
     *
     * Depending on how the image was created, this field may be empty and is
     * only set for images that were built/created locally. This field is empty
     * if the image was pulled from an image registry.
     */
    ParentId: S.String,
    /**
     * List of image names/tags in the local image cache that reference this
     * image.
     *
     * Multiple image tags can refer to the same image, and this list may be
     * empty if no tags reference the image, in which case the image is
     * "untagged", in which case it can still be referenced by its ID.
     */
    RepoTags: S.Array(S.String),
    /**
     * List of content-addressable digests of locally available image manifests
     * that the image is referenced from. Multiple manifests can refer to the
     * same image.
     *
     * These digests are usually only available if the image was either pulled
     * from a registry, or if the image was pushed to a registry, which is when
     * the manifest is generated and its digest calculated.
     */
    RepoDigests: S.Array(S.String),
    /**
     * Date and time at which the image was created as a Unix timestamp (number
     * of seconds sinds EPOCH).
     */
    Created: pipe(S.Number, S.int()),
    /** Total size of the image including all layers it is composed of. */
    Size: pipe(S.Number, S.int()),
    /**
     * Total size of image layers that are shared between this image and other
     * images.
     *
     * This size is not calculated by default. `-1` indicates that the value has
     * not been set / calculated.
     */
    SharedSize: pipe(S.Number, S.int()),
    /**
     * Total size of the image including all layers it is composed of.
     *
     * Deprecated: this field is omitted in API v1.44, but kept for backward
     * compatibility. Use Size instead.
     */
    VirtualSize: S.optional(pipe(S.Number, S.int())),
    /** User-defined key/value metadata. */
    Labels: S.Record(S.String, S.String),
    /**
     * Number of containers using this image. Includes both stopped and running
     * containers.
     *
     * This size is not calculated by default, and depends on which API endpoint
     * is used. `-1` indicates that the value has not been set / calculated.
     */
    Containers: pipe(S.Number, S.int()),
});

export type ImageSummary = S.Schema.Type<typeof ImageSummary>;
export const ImageSummaryEncoded = S.encodedSchema(ImageSummary);
export type ImageSummaryEncoded = S.Schema.Encoded<typeof ImageSummary>;
