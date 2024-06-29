import { Schema as S } from "@effect/schema";

/**
 * Describes the platform which the image in the manifest runs on, as defined in
 * the [OCI Image Index
 * Specification](https://github.com/opencontainers/image-spec/blob/v1.0.1/image-index.md).
 */
export const OCIPlatform = S.Struct({
    /** The CPU architecture, for example `amd64` or `ppc64`. */
    architecture: S.optional(S.String),
    /** The operating system, for example `linux` or `windows`. */
    os: S.optional(S.String),
    /**
     * Optional field specifying the operating system version, for example on
     * Windows `10.0.19041.1165`.
     */
    "os.version": S.optional(S.String),
    /**
     * Optional field specifying an array of strings, each listing a required OS
     * feature (for example on Windows `win32k`).
     */
    "os.features": S.optional(S.Array(S.String)),
    /**
     * Optional field specifying a variant of the CPU, for example `v7` to
     * specify ARMv7 when architecture is `arm`.
     */
    variant: S.optional(S.String),
});

export type OCIPlatform = S.Schema.Type<typeof OCIPlatform>;
export const OCIPlatformEncoded = S.encodedSchema(OCIPlatform);
export type OCIPlatformEncoded = S.Schema.Encoded<typeof OCIPlatform>;
