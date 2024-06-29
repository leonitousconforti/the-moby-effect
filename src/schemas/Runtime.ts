import { Schema as S } from "@effect/schema";

/**
 * Runtime describes an [OCI
 * compliant](https://github.com/opencontainers/runtime-spec) runtime.
 *
 * The runtime is invoked by the daemon via the `containerd` daemon. OCI
 * runtimes act as an interface to the Linux kernel namespaces, cgroups, and
 * SELinux.
 */
export const Runtime = S.Struct({
    /**
     * Name and, optional, path, of the OCI executable binary.
     *
     * If the path is omitted, the daemon searches the host's `$PATH` for the
     * binary and uses the first result.
     */
    path: S.optional(S.String),
    /** List of command-line arguments to pass to the runtime when invoked. */
    runtimeArgs: S.optional(S.Array(S.String)),
    /**
     * Information specific to the runtime.
     *
     * While this API specification does not define data provided by runtimes,
     * the following well-known properties may be provided by runtimes:
     *
     * `org.opencontainers.runtime-spec.features`: features structure as defined
     * in the [OCI Runtime
     * Specification](https://github.com/opencontainers/runtime-spec/blob/main/features.md),
     * in a JSON string representation. <p><br /></p>> **Note**: The information
     * returned in this field, including the formatting of values and> Labels,
     * should not be considered stable, and may change without notice.
     */
    status: S.optional(S.Record(S.String, S.String)),
});

export type Runtime = S.Schema.Type<typeof Runtime>;
export const RuntimeEncoded = S.encodedSchema(Runtime);
export type RuntimeEncoded = S.Schema.Encoded<typeof Runtime>;
