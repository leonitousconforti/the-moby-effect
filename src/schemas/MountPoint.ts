import { Schema as S } from "@effect/schema";

/**
 * MountPoint represents a mount point configuration inside the container. This
 * is used for reporting the mountpoints in use by a container.
 */
export const MountPoint = S.Struct({
    /**
     * The mount type:
     *
     * - `bind` a mount of a file or directory from the host into the container.
     * - `volume` a docker volume with the given `Name`.
     * - `tmpfs` a `tmpfs`.
     * - `npipe` a named pipe from the host into the container.
     * - `cluster` a Swarm cluster volume
     */
    Type: S.optional(S.Literal("bind", "volume", "tmpfs", "npipe", "cluster")),
    /**
     * Name is the name reference to the underlying data defined by `Source`
     * e.g., the volume name.
     */
    Name: S.optional(S.String),
    /**
     * Source location of the mount.
     *
     * For volumes, this contains the storage location of the volume (within
     * `/var/lib/docker/volumes/`). For bind-mounts, and `npipe`, this contains
     * the source (host) part of the bind-mount. For `tmpfs` mount points, this
     * field is empty.
     */
    Source: S.optional(S.String),
    /**
     * Destination is the path relative to the container root (`/`) where the
     * `Source` is mounted inside the container.
     */
    Destination: S.optional(S.String),
    /**
     * Driver is the volume driver used to create the volume (if it is a
     * volume).
     */
    Driver: S.optional(S.String),
    /**
     * Mode is a comma separated list of options supplied by the user when
     * creating the bind/volume mount.
     *
     * The default is platform-specific (`"z"` on Linux, empty on Windows).
     */
    Mode: S.optional(S.String),
    /** Whether the mount is mounted writable (read-write). */
    RW: S.optional(S.Boolean),
    /**
     * Propagation describes how mounts are propagated from the host into the
     * mount point, and vice-versa. Refer to the [Linux kernel
     * documentation](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
     * for details. This field is not used on Windows.
     */
    Propagation: S.optional(S.String),
});

export type MountPoint = S.Schema.Type<typeof MountPoint>;
export const MountPointEncoded = S.encodedSchema(MountPoint);
export type MountPointEncoded = S.Schema.Encoded<typeof MountPoint>;
