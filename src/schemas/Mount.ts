import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

export const Mount = S.Struct({
    /** Container path. */
    Target: S.optional(S.String),
    /** Mount source (e.g. a volume name, a host path). */
    Source: S.optional(S.String),
    /**
     * The mount type. Available types:
     *
     * - `bind` Mounts a file or directory from the host into the container. Must
     *   exist prior to creating the container.
     * - `volume` Creates a volume with the given name and options (or uses a
     *   pre-existing volume with the same name and options). These are **not**
     *   removed when the container is removed.
     * - `tmpfs` Create a tmpfs with the given options. The mount source cannot be
     *   specified for tmpfs.
     * - `npipe` Mounts a named pipe from the host into the container. Must exist
     *   prior to creating the container.
     * - `cluster` a Swarm cluster volume
     */
    Type: S.optional(S.Literal("bind", "volume", "tmpfs", "npipe", "cluster")),
    /** Whether the mount should be read-only. */
    ReadOnly: S.optional(S.Boolean),
    /**
     * The consistency requirement for the mount: `default`, `consistent`,
     * `cached`, or `delegated`.
     */
    Consistency: S.optional(S.String),
    /** Optional configuration for the `bind` type. */
    BindOptions: S.optional(
        S.Struct({
            /**
             * A propagation mode with the value `[r]private`, `[r]shared`, or
             * `[r]slave`.
             */
            Propagation: S.optional(S.Literal("private", "rprivate", "shared", "rshared", "slave", "rslave")),
            /** Disable recursive bind mount. */
            NonRecursive: S.optional(S.Boolean, {
                default: () => false,
            }),
            /** Create mount point on host if missing */
            CreateMountpoint: S.optional(S.Boolean, {
                default: () => false,
            }),
            /**
             * Make the mount non-recursively read-only, but still leave the
             * mount recursive (unless NonRecursive is set to `true` in
             * conjunction).
             *
             *     Addded in v1.44, before that version all read-only mounts were
             *     non-recursive by default. To match the previous behaviour this
             *     will default to `true` for clients on versions prior to v1.44.
             */
            ReadOnlyNonRecursive: S.optional(S.Boolean, {
                default: () => false,
            }),
            /** Raise an error if the mount cannot be made recursively read-only. */
            ReadOnlyForceRecursive: S.optional(S.Boolean, {
                default: () => false,
            }),
        })
    ),
    /** Optional configuration for the `volume` type. */
    VolumeOptions: S.optional(
        S.Struct({
            /** Populate volume with data from the target. */
            NoCopy: S.optional(S.Boolean, {
                default: () => false,
            }),
            /** User-defined key/value metadata. */
            Labels: S.optional(S.Record(S.String, S.String)),
            /** Map of driver specific options */
            DriverConfig: S.optional(
                S.Struct({
                    /** Name of the driver to use to create the volume. */
                    Name: S.optional(S.String),
                    /** Key/value map of driver specific options. */
                    Options: S.optional(S.Record(S.String, S.String)),
                })
            ),
            /**
             * Source path inside the volume. Must be relative without any back
             * traversals.
             */
            Subpath: S.optional(S.String),
        })
    ),
    /** Optional configuration for the `tmpfs` type. */
    TmpfsOptions: S.optional(
        S.Struct({
            /** The size for the tmpfs mount in bytes. */
            SizeBytes: S.optional(pipe(S.Number, S.int())),
            /** The permission mode for the tmpfs mount in an integer. */
            Mode: S.optional(pipe(S.Number, S.int())),
        })
    ),
});

export type Mount = S.Schema.Type<typeof Mount>;
export const MountEncoded = S.encodedSchema(Mount);
export type MountEncoded = S.Schema.Encoded<typeof Mount>;
