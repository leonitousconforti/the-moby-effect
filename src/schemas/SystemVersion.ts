import { Schema as S } from "@effect/schema";

/** Response of Engine API: GET "/version" */
export const SystemVersion = S.Struct({
    Platform: S.optional(
        S.Struct({
            Name: S.String,
        })
    ),
    /** Information about system components */
    Components: S.optional(
        S.Array(
            S.Struct({
                /** Name of the component */
                Name: S.String,
                /** Version of the component */
                Version: S.String,
                /**
                 * Key/value pairs of strings with additional information about
                 * the component. These values are intended for informational
                 * purposes only, and their content is not defined, and not part
                 * of the API specification.
                 *
                 *     These messages can be printed by the client as information to the user.
                 */
                Details: S.optional(S.Struct({})),
            })
        )
    ),
    /** The version of the daemon */
    Version: S.optional(S.String),
    /** The default (and highest) API version that is supported by the daemon */
    ApiVersion: S.optional(S.String),
    /** The minimum API version that is supported by the daemon */
    MinAPIVersion: S.optional(S.String),
    /** The Git commit of the source code that was used to build the daemon */
    GitCommit: S.optional(S.String),
    /**
     * The version Go used to compile the daemon, and the version of the Go
     * runtime in use.
     */
    GoVersion: S.optional(S.String),
    /** The operating system that the daemon is running on ("linux" or "windows") */
    Os: S.optional(S.String),
    /** The architecture that the daemon is running on */
    Arch: S.optional(S.String),
    /**
     * The kernel version (`uname -r`) that the daemon is running on.
     *
     * This field is omitted when empty.
     */
    KernelVersion: S.optional(S.String),
    /**
     * Indicates if the daemon is started with experimental features enabled.
     *
     * This field is omitted when empty / false.
     */
    Experimental: S.optional(S.Boolean),
    /** The date and time that the daemon was compiled. */
    BuildTime: S.optional(S.String),
});

export type SystemVersion = S.Schema.Type<typeof SystemVersion>;
export const SystemVersionEncoded = S.encodedSchema(SystemVersion);
export type SystemVersionEncoded = S.Schema.Encoded<typeof SystemVersion>;
