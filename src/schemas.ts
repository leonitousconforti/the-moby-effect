import * as Schema from "@effect/schema/Schema";
import {
    Date as DateSchema,
    any as anySchema,
    array as arraySchema,
    boolean as booleanSchema,
    number as numberSchema,
    record as recordSchema,
    string as stringSchema,
} from "@effect/schema/Schema";

/** Address represents an IPv4 or IPv6 IP address. */
export const AddressSchema = Schema.struct({
    /** IP address. */
    Addr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Mask length of the IP address. */
    PrefixLen: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Address extends Schema.Schema.To<typeof AddressSchema> {}

export const AuthConfigSchema = Schema.struct({
    username: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    password: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    email: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    serveraddress: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface AuthConfig extends Schema.Schema.To<typeof AuthConfigSchema> {}

export enum BuildCache_TypeEnum {
    Internal = "internal",
    Frontend = "frontend",
    SourceLocal = "source.local",
    SourceGitCheckout = "source.git.checkout",
    ExecCachemount = "exec.cachemount",
    Regular = "regular",
}

/** BuildCache contains information about a build cache record. */
export const BuildCacheSchema = Schema.struct({
    /** Unique ID of the build cache record. */
    ID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * ID of the parent build cache record. **Deprecated**: This field is
     * deprecated, and omitted if empty.
     */
    Parent: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** List of parent build cache record IDs. */
    Parents: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Cache record type. */
    Type: Schema.enums(BuildCache_TypeEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /** Description of the build-step that produced the build cache. */
    Description: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Indicates if the build cache is in use. */
    InUse: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Indicates if the build cache is shared. */
    Shared: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Amount of disk space used by the build cache (in bytes). */
    Size: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Date and time at which the build cache was created in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    CreatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Date and time at which the build cache was last used in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    LastUsedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    UsageCount: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface BuildCache extends Schema.Schema.To<typeof BuildCacheSchema> {}

export const BuildPruneResponseSchema = Schema.struct({
    CachesDeleted: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Disk space reclaimed in bytes */
    SpaceReclaimed: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface BuildPruneResponse extends Schema.Schema.To<typeof BuildPruneResponseSchema> {}

/**
 * Kind of change Can be one of:
 *
 * - `0`: Modified ("C")
 * - `1`: Added ("A")
 * - `2`: Deleted ("D")
 */
export enum ChangeType {
    NUMBER_0 = 0,
    NUMBER_1 = 1,
    NUMBER_2 = 2,
}

export enum ClusterVolumePublishStatus_StateEnum {
    PendingPublish = "pending-publish",
    Published = "published",
    PendingNodeUnpublish = "pending-node-unpublish",
    PendingControllerUnpublish = "pending-controller-unpublish",
}

export const ClusterVolumePublishStatusSchema = Schema.struct({
    /** The ID of the Swarm node the volume is published on. */
    NodeID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The published state of the volume. * `pending-publish` The volume should
     * be published to this node, but the call to the controller plugin to do so
     * has not yet been successfully completed. * `published` The volume is
     * published successfully to the node. * `pending-node-unpublish` The volume
     * should be unpublished from the node, and the manager is awaiting
     * confirmation from the worker that it has done so. *
     * `pending-controller-unpublish` The volume is successfully unpublished
     * from the node, but has not yet been successfully unpublished on the
     * controller.
     */
    State: Schema.enums(ClusterVolumePublishStatus_StateEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * A map of strings to strings returned by the CSI controller plugin when a
     * volume is published.
     */
    PublishContext: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ClusterVolumePublishStatus extends Schema.Schema.To<typeof ClusterVolumePublishStatusSchema> {}

/**
 * The desired capacity that the volume should be created with. If empty, the
 * plugin will decide the capacity.
 */
export const ClusterVolumeSpecAccessModeCapacityRangeSchema = Schema.struct({
    /**
     * The volume must be at least this big. The value of 0 indicates an
     * unspecified minimum
     */
    RequiredBytes: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The volume must not be bigger than this. The value of 0 indicates an
     * unspecified maximum.
     */
    LimitBytes: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ClusterVolumeSpecAccessModeCapacityRange
    extends Schema.Schema.To<typeof ClusterVolumeSpecAccessModeCapacityRangeSchema> {}

/**
 * One cluster volume secret entry. Defines a key-value pair that is passed to
 * the plugin.
 */
export const ClusterVolumeSpecAccessModeSecretsSchema = Schema.struct({
    /** Key is the name of the key of the key-value pair passed to the plugin. */
    Key: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Secret is the swarm Secret object from which to read data. This can be a
     * Secret name or ID. The Secret data is retrieved by swarm and used as the
     * value of the key-value pair passed to the plugin.
     */
    Secret: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ClusterVolumeSpecAccessModeSecrets
    extends Schema.Schema.To<typeof ClusterVolumeSpecAccessModeSecretsSchema> {}

/**
 * Commit holds the Git-commit (SHA1) that a binary was built from, as reported
 * in the version-string of external tools, such as `containerd`, or `runC`.
 */
export const CommitSchema = Schema.struct({
    /** Actual commit ID of external tool. */
    ID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Commit ID of external tool expected by dockerd as set at build time. */
    Expected: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Commit extends Schema.Schema.To<typeof CommitSchema> {}

/** OK response to ContainerCreate operation */
export const ContainerCreateResponseSchema = Schema.struct({
    /** The ID of the created container */
    Id: stringSchema,
    /** Warnings encountered when creating the container */
    Warnings: arraySchema(stringSchema),
});

export interface ContainerCreateResponse extends Schema.Schema.To<typeof ContainerCreateResponseSchema> {}

export const ContainerPruneResponseSchema = Schema.struct({
    /** Container IDs that were deleted */
    ContainersDeleted: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Disk space reclaimed in bytes */
    SpaceReclaimed: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ContainerPruneResponse extends Schema.Schema.To<typeof ContainerPruneResponseSchema> {}

export const ContainerSummaryHostConfigSchema = Schema.struct({
    NetworkMode: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ContainerSummaryHostConfig extends Schema.Schema.To<typeof ContainerSummaryHostConfigSchema> {}

/** OK response to ContainerTop operation */
export const ContainerTopResponseSchema = Schema.struct({
    /** The ps column titles */
    Titles: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Each process running in the container, where each is process is an array
     * of values corresponding to the titles.
     */
    Processes: arraySchema(arraySchema(stringSchema)).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ContainerTopResponse extends Schema.Schema.To<typeof ContainerTopResponseSchema> {}

/** OK response to ContainerUpdate operation */
export const ContainerUpdateResponseSchema = Schema.struct({
    Warnings: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ContainerUpdateResponse extends Schema.Schema.To<typeof ContainerUpdateResponseSchema> {}

/** Container waiting error, if any */
export const ContainerWaitExitErrorSchema = Schema.struct({
    /** Details of an error */
    Message: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ContainerWaitExitError extends Schema.Schema.To<typeof ContainerWaitExitErrorSchema> {}

/** A device mapping between the host and container */
export const DeviceMappingSchema = Schema.struct({
    PathOnHost: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    PathInContainer: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    CgroupPermissions: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface DeviceMapping extends Schema.Schema.To<typeof DeviceMappingSchema> {}

/** A request for devices to be sent to device drivers */
export const DeviceRequestSchema = Schema.struct({
    Driver: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Count: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    DeviceIDs: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** A list of capabilities; an OR list of AND lists of capabilities. */
    Capabilities: arraySchema(arraySchema(stringSchema)).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Driver-specific options, specified as a key/value pairs. These options
     * are passed directly to the driver.
     */
    Options: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface DeviceRequest extends Schema.Schema.To<typeof DeviceRequestSchema> {}

/** Driver represents a driver (network, logging, secrets). */
export const DriverSchema = Schema.struct({
    /** Name of the driver. */
    Name: stringSchema,
    /** Key/value map of driver-specific options. */
    Options: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Driver extends Schema.Schema.To<typeof DriverSchema> {}

/** EndpointIPAMConfig represents an endpoint's IPAM configuration. */
export const EndpointIPAMConfigSchema = Schema.struct({
    IPv4Address: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    IPv6Address: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    LinkLocalIPs: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface EndpointIPAMConfig extends Schema.Schema.To<typeof EndpointIPAMConfigSchema> {}

export enum EndpointPortConfig_ProtocolEnum {
    Tcp = "tcp",
    Udp = "udp",
    Sctp = "sctp",
}

export enum EndpointPortConfig_PublishModeEnum {
    Ingress = "ingress",
    Host = "host",
}

export const EndpointPortConfigSchema = Schema.struct({
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Protocol: Schema.enums(EndpointPortConfig_ProtocolEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /** The port inside the container. */
    TargetPort: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The port on the swarm hosts. */
    PublishedPort: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The mode in which port is published.
     *
     * - "ingress" makes the target port accessible on every node, regardless of
     *   whether there is a task for the service running on that node or not.
     * - "host" bypasses the routing mesh and publish the port directly on the
     *   swarm node where that service is running.
     */
    PublishMode: Schema.enums(EndpointPortConfig_PublishModeEnum).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface EndpointPortConfig extends Schema.Schema.To<typeof EndpointPortConfigSchema> {}

export const EngineDescriptionPluginsSchema = Schema.struct({
    Type: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface EngineDescriptionPlugins extends Schema.Schema.To<typeof EngineDescriptionPluginsSchema> {}

export const ErrorDetailSchema = Schema.struct({
    code: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    message: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ErrorDetail extends Schema.Schema.To<typeof ErrorDetailSchema> {}

/** Represents an error. */
export const ErrorResponseSchema = Schema.struct({
    /** The error message. */
    message: stringSchema,
});

export interface ErrorResponse extends Schema.Schema.To<typeof ErrorResponseSchema> {}

/**
 * Actor describes something that generates events, like a container, network,
 * or a volume.
 */
export const EventActorSchema = Schema.struct({
    /** The ID of the object emitting the event */
    ID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Various key/value attributes of the object, depending on its type. */
    Attributes: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface EventActor extends Schema.Schema.To<typeof EventActorSchema> {}

export const ExecConfigSchema = Schema.struct({
    /** Attach to `stdin` of the exec command. */
    AttachStdin: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Attach to `stdout` of the exec command. */
    AttachStdout: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Attach to `stderr` of the exec command. */
    AttachStderr: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Initial console size, as an `[height, width]` array. */
    ConsoleSize: arraySchema(numberSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Override the key sequence for detaching a container. Format is a single
     * character `[a-Z]` or `ctrl-<value>` where `<value>` is one of: `a-z`,
     * `@`, `^`, `[`, `,` or `_`.
     */
    DetachKeys: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Allocate a pseudo-TTY. */
    Tty: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** A list of environment variables in the form `[\"VAR=value\", ...]`. */
    Env: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Command to run, as a string or array of strings. */
    Cmd: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Runs the exec process with extended privileges. */
    Privileged: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The user, and optionally, group to run the exec process inside the
     * container. Format is one of: `user`, `user:group`, `uid`, or `uid:gid`.
     */
    User: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The working directory for the exec process inside the container. */
    WorkingDir: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ExecConfig extends Schema.Schema.To<typeof ExecConfigSchema> {}

export const ExecStartConfigSchema = Schema.struct({
    /** Detach from the command. */
    Detach: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Allocate a pseudo-TTY. */
    Tty: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Initial console size, as an `[height, width]` array. */
    ConsoleSize: arraySchema(numberSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ExecStartConfig extends Schema.Schema.To<typeof ExecStartConfigSchema> {}

export const GenericResourcesInnerSchema = Schema.struct({
    NamedResourceSpec: anySchema.pipe(Schema.nullable).pipe(Schema.optional),
    DiscreteResourceSpec: anySchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface GenericResourcesInner extends Schema.Schema.To<typeof GenericResourcesInnerSchema> {}

/**
 * Information about the storage driver used to store the container's and
 * image's filesystem.
 */
export const GraphDriverDataSchema = Schema.struct({
    /** Name of the storage driver. */
    Name: stringSchema,
    /**
     * Low-level storage metadata, provided as key/value pairs. This information
     * is driver-specific, and depends on the storage-driver in use, and should
     * be used for informational purposes only.
     */
    Data: recordSchema(stringSchema, stringSchema),
});

export interface GraphDriverData extends Schema.Schema.To<typeof GraphDriverDataSchema> {}

/** A test to perform to check that the container is healthy. */
export const HealthConfigSchema = Schema.struct({
    /**
     * The test to perform. Possible values are:
     *
     * - `[]` inherit healthcheck from image or parent image
     * - `[\"NONE\"]` disable healthcheck
     * - `[\"CMD\", args...]` exec arguments directly
     * - `[\"CMD-SHELL\", command]` run command with system's default shell
     */
    Test: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The time to wait between checks in nanoseconds. It should be 0 or at
     * least 1000000 (1 ms). 0 means inherit.
     */
    Interval: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The time to wait before considering the check to have hung. It should be
     * 0 or at least 1000000 (1 ms). 0 means inherit.
     */
    Timeout: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The number of consecutive failures needed to consider a container as
     * unhealthy. 0 means inherit.
     */
    Retries: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Start period for the container to initialize before starting
     * health-retries countdown in nanoseconds. It should be 0 or at least
     * 1000000 (1 ms). 0 means inherit.
     */
    StartPeriod: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface HealthConfig extends Schema.Schema.To<typeof HealthConfigSchema> {}

/**
 * HealthcheckResult stores information about a single run of a healthcheck
 * probe
 */
export const HealthcheckResultSchema = Schema.struct({
    /**
     * Date and time at which this check started in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    Start: DateSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Date and time at which this check ended in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    End: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * ExitCode meanings:
     *
     * - `0` healthy
     * - `1` unhealthy
     * - `2` reserved (considered unhealthy)
     * - Other values: error running probe
     */
    ExitCode: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Output from last check */
    Output: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface HealthcheckResult extends Schema.Schema.To<typeof HealthcheckResultSchema> {}

/** Individual image layer information in response to ImageHistory operation */
export const HistoryResponseItemSchema = Schema.struct({
    Id: stringSchema,
    Created: numberSchema,
    CreatedBy: stringSchema,
    Tags: arraySchema(stringSchema),
    Size: numberSchema,
    Comment: stringSchema,
});

export interface HistoryResponseItem extends Schema.Schema.To<typeof HistoryResponseItemSchema> {}

export enum HostConfigLogConfig_TypeEnum {
    JsonFile = "json-file",
    Syslog = "syslog",
    Journald = "journald",
    Gelf = "gelf",
    Fluentd = "fluentd",
    Awslogs = "awslogs",
    Splunk = "splunk",
    Etwlogs = "etwlogs",
    None = "none",
}

/** The logging configuration for this container */
export const HostConfigLogConfigSchema = Schema.struct({
    Type: Schema.enums(HostConfigLogConfig_TypeEnum).pipe(Schema.nullable).pipe(Schema.optional),
    Config: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface HostConfigLogConfig extends Schema.Schema.To<typeof HostConfigLogConfigSchema> {}

export const IPAMConfigSchema = Schema.struct({
    Subnet: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    IPRange: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Gateway: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    AuxiliaryAddresses: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface IPAMConfig extends Schema.Schema.To<typeof IPAMConfigSchema> {}

/** Response to an API call that returns just an Id */
export const IdResponseSchema = Schema.struct({
    /** The id of the newly created object. */
    Id: stringSchema,
});

export interface IdResponse extends Schema.Schema.To<typeof IdResponseSchema> {}

export const ImageDeleteResponseItemSchema = Schema.struct({
    /** The image ID of an image that was untagged */
    Untagged: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The image ID of an image that was deleted */
    Deleted: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ImageDeleteResponseItem extends Schema.Schema.To<typeof ImageDeleteResponseItemSchema> {}

/** Image ID or Digest */
export const ImageIDSchema = Schema.struct({
    ID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ImageID extends Schema.Schema.To<typeof ImageIDSchema> {}

/**
 * Additional metadata of the image in the local cache. This information is
 * local to the daemon, and not part of the image itself.
 */
export const ImageInspectMetadataSchema = Schema.struct({
    /**
     * Date and time at which the image was last tagged in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     * This information is only available if the image was tagged locally, and
     * omitted otherwise.
     */
    LastTagTime: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ImageInspectMetadata extends Schema.Schema.To<typeof ImageInspectMetadataSchema> {}

/** Information about the image's RootFS, including the layer IDs. */
export const ImageInspectRootFSSchema = Schema.struct({
    Type: stringSchema,
    Layers: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ImageInspectRootFS extends Schema.Schema.To<typeof ImageInspectRootFSSchema> {}

export const ImageSearchResponseItemSchema = Schema.struct({
    description: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    is_official: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    is_automated: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    star_count: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ImageSearchResponseItem extends Schema.Schema.To<typeof ImageSearchResponseItemSchema> {}

export const ImageSummarySchema = Schema.struct({
    /**
     * ID is the content-addressable ID of an image. This identifier is a
     * content-addressable digest calculated from the image's configuration
     * (which includes the digests of layers used by the image). Note that this
     * digest differs from the `RepoDigests` below, which holds digests of image
     * manifests that reference the image.
     */
    Id: stringSchema,
    /**
     * ID of the parent image. Depending on how the image was created, this
     * field may be empty and is only set for images that were built/created
     * locally. This field is empty if the image was pulled from an image
     * registry.
     */
    ParentId: stringSchema,
    /**
     * List of image names/tags in the local image cache that reference this
     * image. Multiple image tags can refer to the same image, and this list may
     * be empty if no tags reference the image, in which case the image is
     * "untagged", in which case it can still be referenced by its ID.
     */
    RepoTags: arraySchema(stringSchema),
    /**
     * List of content-addressable digests of locally available image manifests
     * that the image is referenced from. Multiple manifests can refer to the
     * same image. These digests are usually only available if the image was
     * either pulled from a registry, or if the image was pushed to a registry,
     * which is when the manifest is generated and its digest calculated.
     */
    RepoDigests: arraySchema(stringSchema),
    /**
     * Date and time at which the image was created as a Unix timestamp (number
     * of seconds sinds EPOCH).
     */
    Created: numberSchema,
    /** Total size of the image including all layers it is composed of. */
    Size: numberSchema,
    /**
     * Total size of image layers that are shared between this image and other
     * images. This size is not calculated by default. `-1` indicates that the
     * value has not been set / calculated.
     */
    SharedSize: numberSchema,
    /**
     * Total size of the image including all layers it is composed of. In
     * versions of Docker before v1.10, this field was calculated from the image
     * itself and all of its parent images. Images are now stored
     * self-contained, and no longer use a parent-chain, making this field an
     * equivalent of the Size field. Deprecated: this field is kept for backward
     * compatibility, and will be removed in API v1.44.
     */
    VirtualSize: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** User-defined key/value metadata. */
    Labels: recordSchema(stringSchema, stringSchema),
    /**
     * Number of containers using this image. Includes both stopped and running
     * containers. This size is not calculated by default, and depends on which
     * API endpoint is used. `-1` indicates that the value has not been set /
     * calculated.
     */
    Containers: numberSchema,
});

export interface ImageSummary extends Schema.Schema.To<typeof ImageSummarySchema> {}

/** IndexInfo contains information about a registry. */
export const IndexInfoSchema = Schema.struct({
    /** Name of the registry, such as "docker.io". */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** List of mirrors, expressed as URIs. */
    Mirrors: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Indicates if the registry is part of the list of insecure registries. If
     * `false`, the registry is insecure. Insecure registries accept
     * un-encrypted (HTTP) and/or untrusted (HTTPS with certificates from
     * unknown CAs) communication. **Warning**: Insecure registries can be
     * useful when running a local registry. However, because its use creates
     * security vulnerabilities it should ONLY be enabled for testing purposes.
     * For increased security, users should add their CA to their system's list
     * of trusted CAs instead of enabling this option.
     */
    Secure: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Indicates whether this is an official registry (i.e., Docker Hub /
     * docker.io)
     */
    Official: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface IndexInfo extends Schema.Schema.To<typeof IndexInfoSchema> {}

/** JoinTokens contains the tokens workers and managers need to join the swarm. */
export const JoinTokensSchema = Schema.struct({
    /** The token workers can use to join the swarm. */
    Worker: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The token managers can use to join the swarm. */
    Manager: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface JoinTokens extends Schema.Schema.To<typeof JoinTokensSchema> {}

/** An object describing a limit on resources which can be requested by a task. */
export const LimitSchema = Schema.struct({
    NanoCPUs: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    MemoryBytes: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Limits the maximum number of PIDs in the container. Set `0` for
     * unlimited.
     */
    Pids: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Limit extends Schema.Schema.To<typeof LimitSchema> {}

/** Current local status of this node. */
export enum LocalNodeState {
    Empty = "",
    Inactive = "inactive",
    Pending = "pending",
    Active = "active",
    Error = "error",
    Locked = "locked",
}

export enum MountBindOptions_PropagationEnum {
    Private = "private",
    Rprivate = "rprivate",
    Shared = "shared",
    Rshared = "rshared",
    Slave = "slave",
    Rslave = "rslave",
}

/** Optional configuration for the `bind` type. */
export const MountBindOptionsSchema = Schema.struct({
    /**
     * A propagation mode with the value `[r]private`, `[r]shared`, or
     * `[r]slave`.
     */
    Propagation: Schema.enums(MountBindOptions_PropagationEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /** Disable recursive bind mount. */
    NonRecursive: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Create mount point on host if missing */
    CreateMountpoint: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface MountBindOptions extends Schema.Schema.To<typeof MountBindOptionsSchema> {}

export enum MountPoint_TypeEnum {
    Bind = "bind",
    Volume = "volume",
    Tmpfs = "tmpfs",
    Npipe = "npipe",
    Cluster = "cluster",
}

/**
 * MountPoint represents a mount point configuration inside the container. This
 * is used for reporting the mountpoints in use by a container.
 */
export const MountPointSchema = Schema.struct({
    /**
     * The mount type:
     *
     * - `bind` a mount of a file or directory from the host into the container.
     * - `volume` a docker volume with the given `Name`.
     * - `tmpfs` a `tmpfs`.
     * - `npipe` a named pipe from the host into the container.
     * - `cluster` a Swarm cluster volume
     */
    Type: Schema.enums(MountPoint_TypeEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Name is the name reference to the underlying data defined by `Source`
     * e.g., the volume name.
     */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Source location of the mount. For volumes, this contains the storage
     * location of the volume (within `/var/lib/docker/volumes/`). For
     * bind-mounts, and `npipe`, this contains the source (host) part of the
     * bind-mount. For `tmpfs` mount points, this field is empty.
     */
    Source: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Destination is the path relative to the container root (`/`) where the
     * `Source` is mounted inside the container.
     */
    Destination: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Driver is the volume driver used to create the volume (if it is a
     * volume).
     */
    Driver: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Mode is a comma separated list of options supplied by the user when
     * creating the bind/volume mount. The default is platform-specific (`\"z\"`
     * on Linux, empty on Windows).
     */
    Mode: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Whether the mount is mounted writable (read-write). */
    RW: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Propagation describes how mounts are propagated from the host into the
     * mount point, and vice-versa. Refer to the [Linux kernel
     * documentation](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)
     * for details. This field is not used on Windows.
     */
    Propagation: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface MountPoint extends Schema.Schema.To<typeof MountPointSchema> {}

/** Optional configuration for the `tmpfs` type. */
export const MountTmpfsOptionsSchema = Schema.struct({
    /** The size for the tmpfs mount in bytes. */
    SizeBytes: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The permission mode for the tmpfs mount in an integer. */
    Mode: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface MountTmpfsOptions extends Schema.Schema.To<typeof MountTmpfsOptionsSchema> {}

/** Map of driver specific options */
export const MountVolumeOptionsDriverConfigSchema = Schema.struct({
    /** Name of the driver to use to create the volume. */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Key/value map of driver specific options. */
    Options: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface MountVolumeOptionsDriverConfig extends Schema.Schema.To<typeof MountVolumeOptionsDriverConfigSchema> {}

/** Specifies how a service should be attached to a particular network. */
export const NetworkAttachmentConfigSchema = Schema.struct({
    /** The target network for attachment. Must be a network name or ID. */
    Target: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Discoverable alternate names for the service on this network. */
    Aliases: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Driver attachment options for the network target. */
    DriverOpts: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface NetworkAttachmentConfig extends Schema.Schema.To<typeof NetworkAttachmentConfigSchema> {}

export const NetworkContainerSchema = Schema.struct({
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    EndpointID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    MacAddress: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    IPv4Address: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    IPv6Address: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface NetworkContainer extends Schema.Schema.To<typeof NetworkContainerSchema> {}

export const NetworkCreateResponseSchema = Schema.struct({
    /** The ID of the created network. */
    Id: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Warning: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface NetworkCreateResponse extends Schema.Schema.To<typeof NetworkCreateResponseSchema> {}

export const NetworkDisconnectRequestSchema = Schema.struct({
    /** The ID or name of the container to disconnect from the network. */
    Container: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Force the container to disconnect from the network. */
    Force: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface NetworkDisconnectRequest extends Schema.Schema.To<typeof NetworkDisconnectRequestSchema> {}

export const NetworkPruneResponseSchema = Schema.struct({
    /** Networks that were deleted */
    NetworksDeleted: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface NetworkPruneResponse extends Schema.Schema.To<typeof NetworkPruneResponseSchema> {}

export enum NodeSpec_RoleEnum {
    Worker = "worker",
    Manager = "manager",
}

export enum NodeSpec_AvailabilityEnum {
    Active = "active",
    Pause = "pause",
    Drain = "drain",
}

export const NodeSpecSchema = Schema.struct({
    /** Name for the node. */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** User-defined key/value metadata. */
    Labels: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Role of the node. */
    Role: Schema.enums(NodeSpec_RoleEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /** Availability of the node. */
    Availability: Schema.enums(NodeSpec_AvailabilityEnum).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface NodeSpec extends Schema.Schema.To<typeof NodeSpecSchema> {}

/** NodeState represents the state of a node. */
export enum NodeState {
    Unknown = "unknown",
    Down = "down",
    Ready = "ready",
    Disconnected = "disconnected",
}

/**
 * A descriptor struct containing digest, media type, and size, as defined in
 * the [OCI Content Descriptors
 * Specification](https://github.com/opencontainers/image-spec/blob/v1.0.1/descriptor.md).
 */
export const OCIDescriptorSchema = Schema.struct({
    /** The media type of the object this schema refers to. */
    mediaType: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The digest of the targeted content. */
    digest: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The size in bytes of the blob. */
    size: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface OCIDescriptor extends Schema.Schema.To<typeof OCIDescriptorSchema> {}

/**
 * Describes the platform which the image in the manifest runs on, as defined in
 * the [OCI Image Index
 * Specification](https://github.com/opencontainers/image-spec/blob/v1.0.1/image-index.md).
 */
export const OCIPlatformSchema = Schema.struct({
    /** The CPU architecture, for example `amd64` or `ppc64`. */
    architecture: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The operating system, for example `linux` or `windows`. */
    os: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Optional field specifying the operating system version, for example on
     * Windows `10.0.19041.1165`.
     */
    os_version: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Optional field specifying an array of strings, each listing a required OS
     * feature (for example on Windows `win32k`).
     */
    os_features: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Optional field specifying a variant of the CPU, for example `v7` to
     * specify ARMv7 when architecture is `arm`.
     */
    variant: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface OCIPlatform extends Schema.Schema.To<typeof OCIPlatformSchema> {}

/**
 * The version number of the object such as node, service, etc. This is needed
 * to avoid conflicting writes. The client must send the version number along
 * with the modified specification when updating these objects. This approach
 * ensures safe concurrency and determinism in that the change on the object may
 * not be applied if the version number has changed from the last read. In other
 * words, if two update requests specify the same base version, only one of the
 * requests can succeed. As a result, two separate update requests that happen
 * at the same time will not unintentionally overwrite each other.
 */
export const ObjectVersionSchema = Schema.struct({
    Index: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ObjectVersion extends Schema.Schema.To<typeof ObjectVersionSchema> {}

/** Represents a peer-node in the swarm */
export const PeerNodeSchema = Schema.struct({
    /** Unique identifier of for this node in the swarm. */
    NodeID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** IP address and ports at which this node can be reached. */
    Addr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface PeerNode extends Schema.Schema.To<typeof PeerNodeSchema> {}

/** Platform represents the platform (Arch/OS). */
export const PlatformSchema = Schema.struct({
    /**
     * Architecture represents the hardware architecture (for example,
     * `x86_64`).
     */
    Architecture: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** OS represents the Operating System (for example, `linux` or `windows`). */
    OS: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Platform extends Schema.Schema.To<typeof PlatformSchema> {}

export const PluginConfigArgsSchema = Schema.struct({
    Name: stringSchema,
    Description: stringSchema,
    Settable: arraySchema(stringSchema),
    Value: arraySchema(stringSchema),
});

export interface PluginConfigArgs extends Schema.Schema.To<typeof PluginConfigArgsSchema> {}

export const PluginConfigNetworkSchema = Schema.struct({
    Type: stringSchema,
});

export interface PluginConfigNetwork extends Schema.Schema.To<typeof PluginConfigNetworkSchema> {}

export const PluginConfigRootfsSchema = Schema.struct({
    type: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    diff_ids: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface PluginConfigRootfs extends Schema.Schema.To<typeof PluginConfigRootfsSchema> {}

export const PluginConfigUserSchema = Schema.struct({
    UID: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    GID: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface PluginConfigUser extends Schema.Schema.To<typeof PluginConfigUserSchema> {}

export const PluginDeviceSchema = Schema.struct({
    Name: stringSchema,
    Description: stringSchema,
    Settable: arraySchema(stringSchema),
    Path: stringSchema,
});

export interface PluginDevice extends Schema.Schema.To<typeof PluginDeviceSchema> {}

export const PluginEnvSchema = Schema.struct({
    Name: stringSchema,
    Description: stringSchema,
    Settable: arraySchema(stringSchema),
    Value: stringSchema,
});

export interface PluginEnv extends Schema.Schema.To<typeof PluginEnvSchema> {}

export const PluginInterfaceTypeSchema = Schema.struct({
    Prefix: stringSchema,
    Capability: stringSchema,
    Version: stringSchema,
});

export interface PluginInterfaceType extends Schema.Schema.To<typeof PluginInterfaceTypeSchema> {}

export const PluginMountSchema = Schema.struct({
    Name: stringSchema,
    Description: stringSchema,
    Settable: arraySchema(stringSchema),
    Source: stringSchema,
    Destination: stringSchema,
    Type: stringSchema,
    Options: arraySchema(stringSchema),
});

export interface PluginMount extends Schema.Schema.To<typeof PluginMountSchema> {}

/** Describes a permission the user has to accept upon installing the plugin. */
export const PluginPrivilegeSchema = Schema.struct({
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Description: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Value: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface PluginPrivilege extends Schema.Schema.To<typeof PluginPrivilegeSchema> {}

/**
 * Available plugins per type. **Note**: Only unmanaged (V1) plugins are
 * included in this list. V1 plugins are "lazily" loaded, and are not returned
 * in this list if there is no resource using the plugin.
 */
export const PluginsInfoSchema = Schema.struct({
    /** Names of available volume-drivers, and network-driver plugins. */
    Volume: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Names of available network-drivers, and network-driver plugins. */
    Network: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Names of available authorization plugins. */
    Authorization: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Names of available logging-drivers, and logging-driver plugins. */
    Log: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface PluginsInfo extends Schema.Schema.To<typeof PluginsInfoSchema> {}

export enum Port_TypeEnum {
    Tcp = "tcp",
    Udp = "udp",
    Sctp = "sctp",
}

/** An open port on a container */
export const PortSchema = Schema.struct({
    /** Host IP address that the container's port is mapped to */
    IP: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Port on the container */
    PrivatePort: numberSchema,
    /** Port exposed on the host */
    PublicPort: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Type: Schema.enums(Port_TypeEnum),
});

export interface Port extends Schema.Schema.To<typeof PortSchema> {}

/** PortBinding represents a binding between a host IP address and a host port. */
export const PortBindingSchema = Schema.struct({
    /** Host IP address that the container's port is mapped to. */
    HostIp: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Host port number that the container's port is mapped to. */
    HostPort: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface PortBinding extends Schema.Schema.To<typeof PortBindingSchema> {}

/**
 * PortMap describes the mapping of container ports to host ports, using the
 * container's port-number and protocol as key in the format
 * `<port>/<protocol>`, for example, `80/udp`. If a container's port is mapped
 * for multiple protocols, separate entries are added to the mapping table.
 */
export const PortMapSchema = recordSchema(stringSchema, arraySchema(stringSchema).pipe(Schema.nullable));

export interface PortMap extends Schema.Schema.To<typeof PortMapSchema> {}

export const ProcessConfigSchema = Schema.struct({
    privileged: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    user: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    tty: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    entrypoint: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    arguments: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ProcessConfig extends Schema.Schema.To<typeof ProcessConfigSchema> {}

export const ProgressDetailSchema = Schema.struct({
    current: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    total: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ProgressDetail extends Schema.Schema.To<typeof ProgressDetailSchema> {}

/** Reachability represents the reachability of a node. */
export enum Reachability {
    Unknown = "unknown",
    Unreachable = "unreachable",
    Reachable = "reachable",
}

export const ResourcesBlkioWeightDeviceSchema = Schema.struct({
    Path: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Weight: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ResourcesBlkioWeightDevice extends Schema.Schema.To<typeof ResourcesBlkioWeightDeviceSchema> {}

export const ResourcesUlimitsSchema = Schema.struct({
    /** Name of ulimit */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Soft limit */
    Soft: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Hard limit */
    Hard: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ResourcesUlimits extends Schema.Schema.To<typeof ResourcesUlimitsSchema> {}

export enum RestartPolicy_NameEnum {
    Empty = "",
    No = "no",
    Always = "always",
    UnlessStopped = "unless-stopped",
    OnFailure = "on-failure",
}

/**
 * The behavior to apply when the container exits. The default is not to
 * restart. An ever increasing delay (double the previous delay, starting at
 * 100ms) is added before each restart to prevent flooding the server.
 */
export const RestartPolicySchema = Schema.struct({
    /**
     * - Empty string means not to restart
     * - `no` Do not automatically restart
     * - `always` Always restart
     * - `unless-stopped` Restart always except when the user has manually stopped
     *   the container
     * - `on-failure` Restart only when the container exit code is non-zero
     */
    Name: Schema.enums(RestartPolicy_NameEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /** If `on-failure` is used, the number of times to retry before giving up. */
    MaximumRetryCount: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface RestartPolicy extends Schema.Schema.To<typeof RestartPolicySchema> {}

/**
 * Runtime describes an [OCI
 * compliant](https://github.com/opencontainers/runtime-spec) runtime. The
 * runtime is invoked by the daemon via the `containerd` daemon. OCI runtimes
 * act as an interface to the Linux kernel namespaces, cgroups, and SELinux.
 */
export const RuntimeSchema = Schema.struct({
    /**
     * Name and, optional, path, of the OCI executable binary. If the path is
     * omitted, the daemon searches the host's `$PATH` for the binary and uses
     * the first result.
     */
    path: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** List of command-line arguments to pass to the runtime when invoked. */
    runtimeArgs: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Runtime extends Schema.Schema.To<typeof RuntimeSchema> {}

export const ServiceCreateResponseSchema = Schema.struct({
    /** The ID of the created service. */
    ID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Optional warning message */
    Warning: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ServiceCreateResponse extends Schema.Schema.To<typeof ServiceCreateResponseSchema> {}

export const ServiceEndpointVirtualIPsSchema = Schema.struct({
    NetworkID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Addr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ServiceEndpointVirtualIPs extends Schema.Schema.To<typeof ServiceEndpointVirtualIPsSchema> {}

/**
 * The status of the service's tasks. Provided only when requested as part of a
 * ServiceList operation.
 */
export const ServiceServiceStatusSchema = Schema.struct({
    /** The number of tasks for the service currently in the Running state. */
    RunningTasks: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The number of tasks for the service desired to be running. For replicated
     * services, this is the replica count from the service spec. For global
     * services, this is computed by taking count of all tasks for the service
     * with a Desired State other than Shutdown.
     */
    DesiredTasks: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The number of tasks for a job that are in the Completed state. This field
     * must be cross-referenced with the service type, as the value of 0 may
     * mean the service is not in a job mode, or it may mean the job-mode
     * service has no tasks yet Completed.
     */
    CompletedTasks: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ServiceServiceStatus extends Schema.Schema.To<typeof ServiceServiceStatusSchema> {}

export const ServiceSpecModeReplicatedSchema = Schema.struct({
    Replicas: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ServiceSpecModeReplicated extends Schema.Schema.To<typeof ServiceSpecModeReplicatedSchema> {}

/**
 * The mode used for services with a finite number of tasks that run to a
 * completed state.
 */
export const ServiceSpecModeReplicatedJobSchema = Schema.struct({
    /** The maximum number of replicas to run simultaneously. */
    MaxConcurrent: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The total number of replicas desired to reach the Completed state. If
     * unset, will default to the value of `MaxConcurrent`
     */
    TotalCompletions: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ServiceSpecModeReplicatedJob extends Schema.Schema.To<typeof ServiceSpecModeReplicatedJobSchema> {}

export enum ServiceSpecRollbackConfig_FailureActionEnum {
    Continue = "continue",
    Pause = "pause",
}

export enum ServiceSpecRollbackConfig_OrderEnum {
    StopFirst = "stop-first",
    StartFirst = "start-first",
}

/** Specification for the rollback strategy of the service. */
export const ServiceSpecRollbackConfigSchema = Schema.struct({
    /**
     * Maximum number of tasks to be rolled back in one iteration (0 means
     * unlimited parallelism).
     */
    Parallelism: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Amount of time between rollback iterations, in nanoseconds. */
    Delay: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Action to take if an rolled back task fails to run, or stops running
     * during the rollback.
     */
    FailureAction: Schema.enums(ServiceSpecRollbackConfig_FailureActionEnum)
        .pipe(Schema.nullable)
        .pipe(Schema.optional),
    /**
     * Amount of time to monitor each rolled back task for failures, in
     * nanoseconds.
     */
    Monitor: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The fraction of tasks that may fail during a rollback before the failure
     * action is invoked, specified as a floating point number between 0 and 1.
     */
    MaxFailureRatio: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The order of operations when rolling back a task. Either the old task is
     * shut down before the new task is started, or the new task is started
     * before the old task is shut down.
     */
    Order: Schema.enums(ServiceSpecRollbackConfig_OrderEnum).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ServiceSpecRollbackConfig extends Schema.Schema.To<typeof ServiceSpecRollbackConfigSchema> {}

export enum ServiceSpecUpdateConfig_FailureActionEnum {
    Continue = "continue",
    Pause = "pause",
    Rollback = "rollback",
}

export enum ServiceSpecUpdateConfig_OrderEnum {
    StopFirst = "stop-first",
    StartFirst = "start-first",
}

/** Specification for the update strategy of the service. */
export const ServiceSpecUpdateConfigSchema = Schema.struct({
    /**
     * Maximum number of tasks to be updated in one iteration (0 means unlimited
     * parallelism).
     */
    Parallelism: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Amount of time between updates, in nanoseconds. */
    Delay: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Action to take if an updated task fails to run, or stops running during
     * the update.
     */
    FailureAction: Schema.enums(ServiceSpecUpdateConfig_FailureActionEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /** Amount of time to monitor each updated task for failures, in nanoseconds. */
    Monitor: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The fraction of tasks that may fail during an update before the failure
     * action is invoked, specified as a floating point number between 0 and 1.
     */
    MaxFailureRatio: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The order of operations when rolling out an updated task. Either the old
     * task is shut down before the new task is started, or the new task is
     * started before the old task is shut down.
     */
    Order: Schema.enums(ServiceSpecUpdateConfig_OrderEnum).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ServiceSpecUpdateConfig extends Schema.Schema.To<typeof ServiceSpecUpdateConfigSchema> {}

export const ServiceUpdateResponseSchema = Schema.struct({
    /** Optional warning messages */
    Warnings: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ServiceUpdateResponse extends Schema.Schema.To<typeof ServiceUpdateResponseSchema> {}

export enum ServiceUpdateStatus_StateEnum {
    Updating = "updating",
    Paused = "paused",
    Completed = "completed",
}

/** The status of a service update. */
export const ServiceUpdateStatusSchema = Schema.struct({
    State: Schema.enums(ServiceUpdateStatus_StateEnum).pipe(Schema.nullable).pipe(Schema.optional),
    StartedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    CompletedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Message: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ServiceUpdateStatus extends Schema.Schema.To<typeof ServiceUpdateStatusSchema> {}

export const SwarmJoinRequestSchema = Schema.struct({
    /**
     * Listen address used for inter-manager communication if the node gets
     * promoted to manager, as well as determining the networking interface used
     * for the VXLAN Tunnel Endpoint (VTEP).
     */
    ListenAddr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Externally reachable address advertised to other nodes. This can either
     * be an address/port combination in the form `192.168.1.1:4567`, or an
     * interface followed by a port number, like `eth0:4567`. If the port number
     * is omitted, the port number from the listen address is used. If
     * `AdvertiseAddr` is not specified, it will be automatically detected when
     * possible.
     */
    AdvertiseAddr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Address or interface to use for data path traffic (format:
     * `<ip|interface>`), for example, `192.168.1.1`, or an interface, like
     * `eth0`. If `DataPathAddr` is unspecified, the same address as
     * `AdvertiseAddr` is used. The `DataPathAddr` specifies the address that
     * global scope network drivers will publish towards other nodes in order to
     * reach the containers running on this node. Using this parameter it is
     * possible to separate the container data traffic from the management
     * traffic of the cluster.
     */
    DataPathAddr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Addresses of manager nodes already participating in the swarm. */
    RemoteAddrs: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Secret token for joining this swarm. */
    JoinToken: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SwarmJoinRequest extends Schema.Schema.To<typeof SwarmJoinRequestSchema> {}

export const SwarmJoinRequest1Schema = Schema.struct({
    /**
     * Listen address used for inter-manager communication if the node gets
     * promoted to manager, as well as determining the networking interface used
     * for the VXLAN Tunnel Endpoint (VTEP).
     */
    ListenAddr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Externally reachable address advertised to other nodes. This can either
     * be an address/port combination in the form `192.168.1.1:4567`, or an
     * interface followed by a port number, like `eth0:4567`. If the port number
     * is omitted, the port number from the listen address is used. If
     * `AdvertiseAddr` is not specified, it will be automatically detected when
     * possible.
     */
    AdvertiseAddr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Address or interface to use for data path traffic (format:
     * `<ip|interface>`), for example, `192.168.1.1`, or an interface, like
     * `eth0`. If `DataPathAddr` is unspecified, the same address as
     * `AdvertiseAddr` is used. The `DataPathAddr` specifies the address that
     * global scope network drivers will publish towards other nodes in order to
     * reach the containers running on this node. Using this parameter it is
     * possible to separate the container data traffic from the management
     * traffic of the cluster.
     */
    DataPathAddr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Addresses of manager nodes already participating in the swarm. */
    RemoteAddrs: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Secret token for joining this swarm. */
    JoinToken: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SwarmJoinRequest1 extends Schema.Schema.To<typeof SwarmJoinRequest1Schema> {}

export enum SwarmSpecCAConfigExternalCAs_ProtocolEnum {
    Cfssl = "cfssl",
}

export const SwarmSpecCAConfigExternalCAsSchema = Schema.struct({
    /**
     * Protocol for communication with the external CA (currently only `cfssl`
     * is supported).
     */
    Protocol: Schema.enums(SwarmSpecCAConfigExternalCAs_ProtocolEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /** URL where certificate signing requests should be sent. */
    URL: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * An object with key/value pairs that are interpreted as protocol-specific
     * options for the external CA driver.
     */
    Options: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The root CA certificate (in PEM format) this external CA uses to issue
     * TLS certificates (assumed to be to the current swarm root CA certificate
     * if not provided).
     */
    CACert: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SwarmSpecCAConfigExternalCAs extends Schema.Schema.To<typeof SwarmSpecCAConfigExternalCAsSchema> {}

/** Dispatcher configuration. */
export const SwarmSpecDispatcherSchema = Schema.struct({
    /** The delay for an agent to send a heartbeat to the dispatcher. */
    HeartbeatPeriod: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SwarmSpecDispatcher extends Schema.Schema.To<typeof SwarmSpecDispatcherSchema> {}

/** Parameters related to encryption-at-rest. */
export const SwarmSpecEncryptionConfigSchema = Schema.struct({
    /** If set, generate a key and use it to lock data stored on the managers. */
    AutoLockManagers: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SwarmSpecEncryptionConfig extends Schema.Schema.To<typeof SwarmSpecEncryptionConfigSchema> {}

/** Orchestration configuration. */
export const SwarmSpecOrchestrationSchema = Schema.struct({
    /**
     * The number of historic tasks to keep per instance or node. If negative,
     * never remove completed or failed tasks.
     */
    TaskHistoryRetentionLimit: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SwarmSpecOrchestration extends Schema.Schema.To<typeof SwarmSpecOrchestrationSchema> {}

/** Raft configuration. */
export const SwarmSpecRaftSchema = Schema.struct({
    /** The number of log entries between snapshots. */
    SnapshotInterval: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The number of snapshots to keep beyond the current snapshot. */
    KeepOldSnapshots: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The number of log entries to keep around to sync up slow followers after
     * a snapshot is created.
     */
    LogEntriesForSlowFollowers: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The number of ticks that a follower will wait for a message from the
     * leader before becoming a candidate and starting an election.
     * `ElectionTick` must be greater than `HeartbeatTick`. A tick currently
     * defaults to one second, so these translate directly to seconds currently,
     * but this is NOT guaranteed.
     */
    ElectionTick: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The number of ticks between heartbeats. Every HeartbeatTick ticks, the
     * leader will send a heartbeat to the followers. A tick currently defaults
     * to one second, so these translate directly to seconds currently, but this
     * is NOT guaranteed.
     */
    HeartbeatTick: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SwarmSpecRaft extends Schema.Schema.To<typeof SwarmSpecRaftSchema> {}

/**
 * The log driver to use for tasks created in the orchestrator if unspecified by
 * a service. Updating this value only affects new tasks. Existing tasks
 * continue to use their previously configured log driver until recreated.
 */
export const SwarmSpecTaskDefaultsLogDriverSchema = Schema.struct({
    /** The log driver to use as a default for new tasks. */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Driver-specific options for the selected log driver, specified as
     * key/value pairs.
     */
    Options: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SwarmSpecTaskDefaultsLogDriver extends Schema.Schema.To<typeof SwarmSpecTaskDefaultsLogDriverSchema> {}

export const SwarmUnlockRequestSchema = Schema.struct({
    /** The swarm's unlock key. */
    UnlockKey: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SwarmUnlockRequest extends Schema.Schema.To<typeof SwarmUnlockRequestSchema> {}

export const SystemAuthResponseSchema = Schema.struct({
    /** The status of the authentication */
    Status: stringSchema,
    /** An opaque token used to authenticate a user after a successful login */
    IdentityToken: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SystemAuthResponse extends Schema.Schema.To<typeof SystemAuthResponseSchema> {}

export const SystemInfoDefaultAddressPoolsSchema = Schema.struct({
    /** The network address in CIDR format */
    Base: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The network pool size */
    Size: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SystemInfoDefaultAddressPools extends Schema.Schema.To<typeof SystemInfoDefaultAddressPoolsSchema> {}

export const SystemVersionComponentsSchema = Schema.struct({
    /** Name of the component */
    Name: stringSchema,
    /** Version of the component */
    Version: stringSchema,
    /**
     * Key/value pairs of strings with additional information about the
     * component. These values are intended for informational purposes only, and
     * their content is not defined, and not part of the API specification.
     * These messages can be printed by the client as information to the user.
     */
    Details: anySchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SystemVersionComponents extends Schema.Schema.To<typeof SystemVersionComponentsSchema> {}

export const SystemVersionPlatformSchema = Schema.struct({
    Name: stringSchema,
});

export interface SystemVersionPlatform extends Schema.Schema.To<typeof SystemVersionPlatformSchema> {}

/**
 * Information about the issuer of leaf TLS certificates and the trusted root CA
 * certificate.
 */
export const TLSInfoSchema = Schema.struct({
    /**
     * The root CA certificate(s) that are used to validate leaf TLS
     * certificates.
     */
    TrustRoot: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The base64-url-safe-encoded raw subject bytes of the issuer. */
    CertIssuerSubject: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The base64-url-safe-encoded raw public key bytes of the issuer. */
    CertIssuerPublicKey: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TLSInfo extends Schema.Schema.To<typeof TLSInfoSchema> {}

/**
 * Specification for DNS related configurations in resolver configuration file
 * (`resolv.conf`).
 */
export const TaskSpecContainerSpecDNSConfigSchema = Schema.struct({
    /** The IP addresses of the name servers. */
    Nameservers: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** A search list for host-name lookup. */
    Search: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * A list of internal resolver variables to be modified (e.g., `debug`,
     * `ndots:3`, etc.).
     */
    Options: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecContainerSpecDNSConfig extends Schema.Schema.To<typeof TaskSpecContainerSpecDNSConfigSchema> {}

/** File represents a specific target that is backed by a file. */
export const TaskSpecContainerSpecFileSchema = Schema.struct({
    /** Name represents the final filename in the filesystem. */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** UID represents the file UID. */
    UID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** GID represents the file GID. */
    GID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Mode represents the FileMode of the file. */
    Mode: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecContainerSpecFile extends Schema.Schema.To<typeof TaskSpecContainerSpecFileSchema> {}

/**
 * File represents a specific target that is backed by a file. **Note**:
 * `Configs.File` and `Configs.Runtime` are mutually exclusive
 */
export const TaskSpecContainerSpecFile1Schema = Schema.struct({
    /** Name represents the final filename in the filesystem. */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** UID represents the file UID. */
    UID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** GID represents the file GID. */
    GID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Mode represents the FileMode of the file. */
    Mode: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecContainerSpecFile1 extends Schema.Schema.To<typeof TaskSpecContainerSpecFile1Schema> {}

/** CredentialSpec for managed service account (Windows only) */
export const TaskSpecContainerSpecPrivilegesCredentialSpecSchema = Schema.struct({
    /**
     * Load credential spec from a Swarm Config with the given ID. The specified
     * config must also be present in the Configs field with the Runtime
     * property set. **Note**: `CredentialSpec.File`, `CredentialSpec.Registry`,
     * and `CredentialSpec.Config` are mutually exclusive.
     */
    Config: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Load credential spec from this file. The file is read by the daemon, and
     * must be present in the `CredentialSpecs` subdirectory in the docker data
     * directory, which defaults to `C:\\ProgramData\\Docker\\` on Windows. For
     * example, specifying `spec.json` loads
     * `C:\\ProgramData\\Docker\\CredentialSpecs\\spec.json`. **Note**:
     * `CredentialSpec.File`, `CredentialSpec.Registry`, and
     * `CredentialSpec.Config` are mutually exclusive.
     */
    File: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Load credential spec from this value in the Windows registry. The
     * specified registry value must be located in:
     * `HKLM\\SOFTWARE\\Microsoft\\Windows
     * NT\\CurrentVersion\\Virtualization\\Containers\\CredentialSpecs`
     * **Note**: `CredentialSpec.File`, `CredentialSpec.Registry`, and
     * `CredentialSpec.Config` are mutually exclusive.
     */
    Registry: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecContainerSpecPrivilegesCredentialSpec
    extends Schema.Schema.To<typeof TaskSpecContainerSpecPrivilegesCredentialSpecSchema> {}

/** SELinux labels of the container */
export const TaskSpecContainerSpecPrivilegesSELinuxContextSchema = Schema.struct({
    /** Disable SELinux */
    Disable: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** SELinux user label */
    User: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** SELinux role label */
    Role: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** SELinux type label */
    Type: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** SELinux level label */
    Level: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecContainerSpecPrivilegesSELinuxContext
    extends Schema.Schema.To<typeof TaskSpecContainerSpecPrivilegesSELinuxContextSchema> {}

/**
 * Specifies the log driver to use for tasks created from this spec. If not
 * present, the default one for the swarm will be used, finally falling back to
 * the engine default if not specified.
 */
export const TaskSpecLogDriverSchema = Schema.struct({
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Options: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecLogDriver extends Schema.Schema.To<typeof TaskSpecLogDriverSchema> {}

/**
 * Read-only spec type for non-swarm containers attached to swarm overlay
 * networks. **Note**: ContainerSpec, NetworkAttachmentSpec, and PluginSpec
 * areMutually exclusive. PluginSpec is only used when the Runtime field is set
 * to `plugin`. NetworkAttachmentSpec is used when the Runtime field is set to
 * `attachment`.
 */
export const TaskSpecNetworkAttachmentSpecSchema = Schema.struct({
    /** ID of the container represented by this task */
    ContainerID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecNetworkAttachmentSpec extends Schema.Schema.To<typeof TaskSpecNetworkAttachmentSpecSchema> {}

export const TaskSpecPlacementSpreadSchema = Schema.struct({
    /** Label descriptor, such as `engine.labels.az`. */
    SpreadDescriptor: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecPlacementSpread extends Schema.Schema.To<typeof TaskSpecPlacementSpreadSchema> {}

export enum TaskSpecRestartPolicy_ConditionEnum {
    None = "none",
    OnFailure = "on-failure",
    Any = "any",
}

/**
 * Specification for the restart policy which applies to containers created as
 * part of this service.
 */
export const TaskSpecRestartPolicySchema = Schema.struct({
    /** Condition for restart. */
    Condition: Schema.enums(TaskSpecRestartPolicy_ConditionEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /** Delay between restart attempts. */
    Delay: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Maximum attempts to restart a given container before giving up (default
     * value is 0, which is ignored).
     */
    MaxAttempts: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Windows is the time window used to evaluate the restart policy (default
     * value is 0, which is unbounded).
     */
    Window: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecRestartPolicy extends Schema.Schema.To<typeof TaskSpecRestartPolicySchema> {}

export enum TaskState {
    New = "new",
    Allocated = "allocated",
    Pending = "pending",
    Assigned = "assigned",
    Accepted = "accepted",
    Preparing = "preparing",
    Ready = "ready",
    Starting = "starting",
    Running = "running",
    Complete = "complete",
    Shutdown = "shutdown",
    Failed = "failed",
    Rejected = "rejected",
    Remove = "remove",
    Orphaned = "orphaned",
}

export const TaskStatusContainerStatusSchema = Schema.struct({
    ContainerID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    PID: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    ExitCode: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskStatusContainerStatus extends Schema.Schema.To<typeof TaskStatusContainerStatusSchema> {}

export const ThrottleDeviceSchema = Schema.struct({
    /** Device path */
    Path: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Rate */
    Rate: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ThrottleDevice extends Schema.Schema.To<typeof ThrottleDeviceSchema> {}

/**
 * A map of topological domains to topological segments. For in depth details,
 * see documentation for the Topology object in the CSI specification.
 */
export const TopologySchema = recordSchema(stringSchema, stringSchema);

export interface Topology extends Schema.Schema.To<typeof TopologySchema> {}

export const UnlockKeyResponseSchema = Schema.struct({
    /** The swarm's unlock key. */
    UnlockKey: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface UnlockKeyResponse extends Schema.Schema.To<typeof UnlockKeyResponseSchema> {}

export const VolumePruneResponseSchema = Schema.struct({
    /** Volumes that were deleted */
    VolumesDeleted: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Disk space reclaimed in bytes */
    SpaceReclaimed: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface VolumePruneResponse extends Schema.Schema.To<typeof VolumePruneResponseSchema> {}

/**
 * Usage details about the volume. This information is used by the `GET
 * /system/df` endpoint, and omitted in other endpoints.
 */
export const VolumeUsageDataSchema = Schema.struct({
    /**
     * Amount of disk space used by the volume (in bytes). This information is
     * only available for volumes created with the `\"local\"` volume driver.
     * For volumes created with other volume drivers, this field is set to `-1`
     * ("not available")
     */
    Size: numberSchema,
    /**
     * The number of containers referencing this volume. This field is set to
     * `-1` if the reference-count is not available.
     */
    RefCount: numberSchema,
});

export interface VolumeUsageData extends Schema.Schema.To<typeof VolumeUsageDataSchema> {}

export const BuildInfoSchema = Schema.struct({
    id: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    stream: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    error: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    errorDetail: ErrorDetailSchema.pipe(Schema.nullable).pipe(Schema.optional),
    status: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    progress: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    progressDetail: ProgressDetailSchema.pipe(Schema.nullable).pipe(Schema.optional),
    aux: ImageIDSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface BuildInfo extends Schema.Schema.To<typeof BuildInfoSchema> {}

/** Information about the global status of the volume. */
export const ClusterVolumeInfoSchema = Schema.struct({
    /**
     * The capacity of the volume in bytes. A value of 0 indicates that the
     * capacity is unknown.
     */
    CapacityBytes: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * A map of strings to strings returned from the storage plugin when the
     * volume is created.
     */
    VolumeContext: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The ID of the volume as returned by the CSI storage plugin. This is
     * distinct from the volume's ID as provided by Docker. This ID is never
     * used by the user when communicating with Docker to refer to this volume.
     * If the ID is blank, then the Volume has not been successfully created in
     * the plugin yet.
     */
    VolumeID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The topology this volume is actually accessible from. */
    AccessibleTopology: arraySchema(TopologySchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ClusterVolumeInfo extends Schema.Schema.To<typeof ClusterVolumeInfoSchema> {}

/**
 * Requirements for the accessible topology of the volume. These fields are
 * optional. For an in-depth description of what these fields mean, see the CSI
 * specification.
 */
export const ClusterVolumeSpecAccessModeAccessibilityRequirementsSchema = Schema.struct({
    /**
     * A list of required topologies, at least one of which the volume must be
     * accessible from.
     */
    Requisite: arraySchema(TopologySchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** A list of topologies that the volume should attempt to be provisioned in. */
    Preferred: arraySchema(TopologySchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ClusterVolumeSpecAccessModeAccessibilityRequirements
    extends Schema.Schema.To<typeof ClusterVolumeSpecAccessModeAccessibilityRequirementsSchema> {}

export const ConfigSpecSchema = Schema.struct({
    /** User-defined name of the config. */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** User-defined key/value metadata. */
    Labels: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Base64-url-safe-encoded ([RFC
     * 4648](https://tools.ietf.org/html/rfc4648#section-5)) config data.
     */
    Data: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Templating: DriverSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ConfigSpec extends Schema.Schema.To<typeof ConfigSpecSchema> {}

/**
 * Configuration for a container that is portable between hosts. When used as
 * `ContainerConfig` field in an image, `ContainerConfig` is an optional field
 * containing the configuration of the container that was last committed when
 * creating the image. Previous versions of Docker builder used this field to
 * store build cache, and it is not in active use anymore.
 */
export const ContainerConfigSchema = Schema.struct({
    /** The hostname to use for the container, as a valid RFC 1123 hostname. */
    Hostname: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The domain name to use for the container. */
    Domainname: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The user that commands are run as inside the container. */
    User: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Whether to attach to `stdin`. */
    AttachStdin: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Whether to attach to `stdout`. */
    AttachStdout: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Whether to attach to `stderr`. */
    AttachStderr: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * An object mapping ports to an empty object in the form:
     * `{\"<port>/<tcp|udp|sctp>\": {}}`
     */
    ExposedPorts: recordSchema(stringSchema, anySchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Attach standard streams to a TTY, including `stdin` if it is not closed. */
    Tty: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Open `stdin` */
    OpenStdin: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Close `stdin` after one attached client disconnects */
    StdinOnce: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * A list of environment variables to set inside the container in the form
     * `[\"VAR=value\", ...]`. A variable without `=` is removed from the
     * environment, rather than to have an empty value.
     */
    Env: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Command to run specified as a string or an array of strings. */
    Cmd: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    Healthcheck: HealthConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Command is already escaped (Windows only) */
    ArgsEscaped: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The name (or reference) of the image to use when creating the container,
     * or which was used when the container was created.
     */
    Image: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * An object mapping mount point paths inside the container to empty
     * objects.
     */
    Volumes: recordSchema(stringSchema, anySchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** The working directory for commands to run in. */
    WorkingDir: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The entry point for the container as a string or an array of strings. If
     * the array consists of exactly one empty string (`[\"\"]`) then the entry
     * point is reset to system default (i.e., the entry point used by docker
     * when there is no `ENTRYPOINT` instruction in the `Dockerfile`).
     */
    Entrypoint: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Disable networking for the container. */
    NetworkDisabled: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** MAC address of the container. */
    MacAddress: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** `ONBUILD` metadata that were defined in the image's `Dockerfile`. */
    OnBuild: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** User-defined key/value metadata. */
    Labels: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Signal to stop a container as a string or unsigned integer. */
    StopSignal: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Timeout to stop a container in seconds. */
    StopTimeout: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Shell for when `RUN`, `CMD`, and `ENTRYPOINT` uses a shell. */
    Shell: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ContainerConfig extends Schema.Schema.To<typeof ContainerConfigSchema> {}

/** OK response to ContainerWait operation */
export const ContainerWaitResponseSchema = Schema.struct({
    /** Exit code of the container */
    StatusCode: numberSchema,
    Error: ContainerWaitExitErrorSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ContainerWaitResponse extends Schema.Schema.To<typeof ContainerWaitResponseSchema> {}

export const CreateImageInfoSchema = Schema.struct({
    id: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    error: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    errorDetail: ErrorDetailSchema.pipe(Schema.nullable).pipe(Schema.optional),
    status: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    progress: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    progressDetail: ProgressDetailSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface CreateImageInfo extends Schema.Schema.To<typeof CreateImageInfoSchema> {}

/**
 * Describes the result obtained from contacting the registry to retrieve image
 * metadata.
 */
export const DistributionInspectSchema = Schema.struct({
    Descriptor: OCIDescriptorSchema,
    /** An array containing all platforms supported by the image. */
    Platforms: arraySchema(OCIPlatformSchema),
});

export interface DistributionInspect extends Schema.Schema.To<typeof DistributionInspectSchema> {}

/** Configuration for a network endpoint. */
export const EndpointSettingsSchema = Schema.struct({
    IPAMConfig: EndpointIPAMConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Links: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    Aliases: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Unique ID of the network. */
    NetworkID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Unique ID for the service endpoint in a Sandbox. */
    EndpointID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Gateway address for this network. */
    Gateway: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** IPv4 address. */
    IPAddress: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Mask length of the IPv4 address. */
    IPPrefixLen: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** IPv6 gateway address. */
    IPv6Gateway: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Global IPv6 address. */
    GlobalIPv6Address: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Mask length of the global IPv6 address. */
    GlobalIPv6PrefixLen: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** MAC address for the endpoint on this network. */
    MacAddress: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * DriverOpts is a mapping of driver options and values. These options are
     * passed directly to the driver and are driver specific.
     */
    DriverOpts: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface EndpointSettings extends Schema.Schema.To<typeof EndpointSettingsSchema> {}

export enum EndpointSpec_ModeEnum {
    Vip = "vip",
    Dnsrr = "dnsrr",
}

/** Properties that can be configured to access and load balance a service. */
export const EndpointSpecSchema = Schema.struct({
    /** The mode of resolution to use for internal load balancing between tasks. */
    Mode: Schema.enums(EndpointSpec_ModeEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * List of exposed ports that this service is accessible on from the
     * outside. Ports can only be provided if `vip` resolution mode is used.
     */
    Ports: arraySchema(EndpointPortConfigSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface EndpointSpec extends Schema.Schema.To<typeof EndpointSpecSchema> {}

/** EngineDescription provides information about an engine. */
export const EngineDescriptionSchema = Schema.struct({
    EngineVersion: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Labels: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    Plugins: arraySchema(EngineDescriptionPluginsSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface EngineDescription extends Schema.Schema.To<typeof EngineDescriptionSchema> {}

export enum EventMessage_TypeEnum {
    Builder = "builder",
    Config = "config",
    Container = "container",
    Daemon = "daemon",
    Image = "image",
    Network = "network",
    Node = "node",
    Plugin = "plugin",
    Secret = "secret",
    Service = "service",
    Volume = "volume",
}

export enum EventMessage_ScopeEnum {
    Local = "local",
    Swarm = "swarm",
}

/** EventMessage represents the information an event contains. */
export const EventMessageSchema = Schema.struct({
    /** The type of object emitting the event */
    Type: Schema.enums(EventMessage_TypeEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /** The type of event */
    Action: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Actor: EventActorSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Scope of the event. Engine events are `local` scope. Cluster (Swarm)
     * events are `swarm` scope.
     */
    scope: Schema.enums(EventMessage_ScopeEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /** Timestamp of event */
    time: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Timestamp of event, with nanosecond accuracy */
    timeNano: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface EventMessage extends Schema.Schema.To<typeof EventMessageSchema> {}

export const ExecInspectResponseSchema = Schema.struct({
    CanRemove: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    DetachKeys: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    ID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Running: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    ExitCode: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    ProcessConfig: ProcessConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    OpenStdin: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    OpenStderr: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    OpenStdout: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    ContainerID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The system process ID for the exec process. */
    Pid: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ExecInspectResponse extends Schema.Schema.To<typeof ExecInspectResponseSchema> {}

/** Change in the container's filesystem. */
export const FilesystemChangeSchema = Schema.struct({
    /** Path to file or directory that has changed. */
    Path: stringSchema,
    Kind: Schema.enums(ChangeType),
});

export interface FilesystemChange extends Schema.Schema.To<typeof FilesystemChangeSchema> {}

/**
 * User-defined resources can be either Integer resources (e.g, `SSD=3`) or
 * String resources (e.g, `GPU=UUID1`).
 */
export const GenericResourcesSchema = arraySchema(GenericResourcesInnerSchema);

export interface GenericResources extends Schema.Schema.To<typeof GenericResourcesSchema> {}

export enum Health_StatusEnum {
    None = "none",
    Starting = "starting",
    Healthy = "healthy",
    Unhealthy = "unhealthy",
}

/** Health stores information about the container's healthcheck results. */
export const HealthSchema = Schema.struct({
    /**
     * Status is one of `none`, `starting`, `healthy` or `unhealthy`
     *
     * - "none" Indicates there is no healthcheck
     * - "starting" Starting indicates that the container is not yet ready
     * - "healthy" Healthy indicates that the container is running correctly
     * - "unhealthy" Unhealthy indicates that the container has a problem
     */
    Status: Schema.enums(Health_StatusEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /** FailingStreak is the number of consecutive failures */
    FailingStreak: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Log contains the last few results (oldest first) */
    Log: arraySchema(HealthcheckResultSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Health extends Schema.Schema.To<typeof HealthSchema> {}

export const IPAMSchema = Schema.struct({
    /** Name of the IPAM driver to use. */
    Driver: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * List of IPAM configuration options, specified as a map: `{\"Subnet\":
     * <CIDR>, \"IPRange\": <CIDR>, \"Gateway\": <IP address>, \"AuxAddress\":
     * <device_name:IP address>}`
     */
    Config: arraySchema(IPAMConfigSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Driver-specific options, specified as a map. */
    Options: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface IPAM extends Schema.Schema.To<typeof IPAMSchema> {}

export const ImagePruneResponseSchema = Schema.struct({
    /** Images that were deleted */
    ImagesDeleted: arraySchema(ImageDeleteResponseItemSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Disk space reclaimed in bytes */
    SpaceReclaimed: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ImagePruneResponse extends Schema.Schema.To<typeof ImagePruneResponseSchema> {}

/**
 * ManagerStatus represents the status of a manager. It provides the current
 * status of a node's manager component, if the node is a manager.
 */
export const ManagerStatusSchema = Schema.struct({
    Leader: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Reachability: Schema.enums(Reachability).pipe(Schema.nullable).pipe(Schema.optional),
    /** The IP address and port at which the manager is reachable. */
    Addr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ManagerStatus extends Schema.Schema.To<typeof ManagerStatusSchema> {}

/** Optional configuration for the `volume` type. */
export const MountVolumeOptionsSchema = Schema.struct({
    /** Populate volume with data from the target. */
    NoCopy: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** User-defined key/value metadata. */
    Labels: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    DriverConfig: MountVolumeOptionsDriverConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface MountVolumeOptions extends Schema.Schema.To<typeof MountVolumeOptionsSchema> {}

/**
 * NodeStatus represents the status of a node. It provides the current status of
 * the node, as seen by the manager.
 */
export const NodeStatusSchema = Schema.struct({
    State: Schema.enums(NodeState).pipe(Schema.nullable).pipe(Schema.optional),
    Message: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** IP address of the node. */
    Addr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface NodeStatus extends Schema.Schema.To<typeof NodeStatusSchema> {}

export enum PluginConfigInterface_ProtocolSchemeEnum {
    Empty = "",
    MobyPluginsHttpv1 = "moby.plugins.http/v1",
}

/** The interface between Docker and the plugin */
export const PluginConfigInterfaceSchema = Schema.struct({
    Types: arraySchema(PluginInterfaceTypeSchema),
    Socket: stringSchema,
    /** Protocol to use for clients connecting to the plugin. */
    ProtocolScheme: Schema.enums(PluginConfigInterface_ProtocolSchemeEnum).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface PluginConfigInterface extends Schema.Schema.To<typeof PluginConfigInterfaceSchema> {}

export const PluginConfigLinuxSchema = Schema.struct({
    Capabilities: arraySchema(stringSchema),
    AllowAllDevices: booleanSchema,
    Devices: arraySchema(PluginDeviceSchema),
});

export interface PluginConfigLinux extends Schema.Schema.To<typeof PluginConfigLinuxSchema> {}

/** Settings that can be modified by users. */
export const PluginSettingsSchema = Schema.struct({
    Mounts: arraySchema(PluginMountSchema),
    Env: arraySchema(stringSchema),
    Args: arraySchema(stringSchema),
    Devices: arraySchema(PluginDeviceSchema),
});

export interface PluginSettings extends Schema.Schema.To<typeof PluginSettingsSchema> {}

export const PushImageInfoSchema = Schema.struct({
    error: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    status: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    progress: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    progressDetail: ProgressDetailSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface PushImageInfo extends Schema.Schema.To<typeof PushImageInfoSchema> {}

/** RegistryServiceConfig stores daemon registry services configuration. */
export const RegistryServiceConfigSchema = Schema.struct({
    /**
     * List of IP ranges to which nondistributable artifacts can be pushed,
     * using the CIDR syntax [RFC 4632](https://tools.ietf.org/html/4632). Some
     * images (for example, Windows base images) contain artifacts whose
     * distribution is restricted by license. When these images are pushed to a
     * registry, restricted artifacts are not included. This configuration
     * override this behavior, and enables the daemon to push nondistributable
     * artifacts to all registries whose resolved IP address is within the
     * subnet described by the CIDR syntax. This option is useful when pushing
     * images containing nondistributable artifacts to a registry on an
     * air-gapped network so hosts on that network can pull the images without
     * connecting to another server. **Warning**: Nondistributable artifacts
     * typically have restrictions on how and where they can be distributed and
     * shared. Only use this feature to push artifacts to private registries and
     * ensure that you are in compliance with any terms that cover
     * redistributing nondistributable artifacts.
     */
    AllowNondistributableArtifactsCIDRs: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * List of registry hostnames to which nondistributable artifacts can be
     * pushed, using the format `<hostname>[:<port>]` or `<IP
     * address>[:<port>]`. Some images (for example, Windows base images)
     * contain artifacts whose distribution is restricted by license. When these
     * images are pushed to a registry, restricted artifacts are not included.
     * This configuration override this behavior for the specified registries.
     * This option is useful when pushing images containing nondistributable
     * artifacts to a registry on an air-gapped network so hosts on that network
     * can pull the images without connecting to another server. **Warning**:
     * Nondistributable artifacts typically have restrictions on how and where
     * they can be distributed and shared. Only use this feature to push
     * artifacts to private registries and ensure that you are in compliance
     * with any terms that cover redistributing nondistributable artifacts.
     */
    AllowNondistributableArtifactsHostnames: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * List of IP ranges of insecure registries, using the CIDR syntax ([RFC
     * 4632](https://tools.ietf.org/html/4632)). Insecure registries accept
     * un-encrypted (HTTP) and/or untrusted (HTTPS with certificates from
     * unknown CAs) communication. By default, local registries (`127.0.0.0/8`)
     * are configured as insecure. All other registries are secure.
     * Communicating with an insecure registry is not possible if the daemon
     * assumes that registry is secure. This configuration override this
     * behavior, insecure communication with registries whose resolved IP
     * address is within the subnet described by the CIDR syntax. Registries can
     * also be marked insecure by hostname. Those registries are listed under
     * `IndexConfigs` and have their `Secure` field set to `false`. >
     * **Warning**: Using this option can be useful when running a local >
     * registry, but introduces security vulnerabilities. This option should
     * therefore ONLY be used for testing purposes. For increased security,
     * users should add their CA to their system's list of trusted CAs instead
     * of enabling this option.
     */
    InsecureRegistryCIDRs: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    IndexConfigs: recordSchema(stringSchema, IndexInfoSchema.pipe(Schema.nullable))
        .pipe(Schema.nullable)
        .pipe(Schema.optional),
    /**
     * List of registry URLs that act as a mirror for the official (`docker.io`)
     * registry.
     */
    Mirrors: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface RegistryServiceConfig extends Schema.Schema.To<typeof RegistryServiceConfigSchema> {}

/** A container's resources (cgroups config, ulimits, etc) */
export const ResourcesSchema = Schema.struct({
    /**
     * An integer value representing this container's relative CPU weight versus
     * other containers.
     */
    CpuShares: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Memory limit in bytes. */
    Memory: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Path to `cgroups` under which the container's `cgroup` is created. If the
     * path is not absolute, the path is considered to be relative to the
     * `cgroups` path of the init process. Cgroups are created if they do not
     * already exist.
     */
    CgroupParent: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Block IO weight (relative weight). */
    BlkioWeight: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Block IO weight (relative device weight) in the form: `[{\"Path\":
     * \"device_path\", \"Weight\": weight}]`
     */
    BlkioWeightDevice: arraySchema(ResourcesBlkioWeightDeviceSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Limit read rate (bytes per second) from a device, in the form:
     * `[{\"Path\": \"device_path\", \"Rate\": rate}]`
     */
    BlkioDeviceReadBps: arraySchema(ThrottleDeviceSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Limit write rate (bytes per second) to a device, in the form:
     * `[{\"Path\": \"device_path\", \"Rate\": rate}]`
     */
    BlkioDeviceWriteBps: arraySchema(ThrottleDeviceSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Limit read rate (IO per second) from a device, in the form: `[{\"Path\":
     * \"device_path\", \"Rate\": rate}]`
     */
    BlkioDeviceReadIOps: arraySchema(ThrottleDeviceSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Limit write rate (IO per second) to a device, in the form: `[{\"Path\":
     * \"device_path\", \"Rate\": rate}]`
     */
    BlkioDeviceWriteIOps: arraySchema(ThrottleDeviceSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** The length of a CPU period in microseconds. */
    CpuPeriod: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Microseconds of CPU time that the container can get in a CPU period. */
    CpuQuota: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The length of a CPU real-time period in microseconds. Set to 0 to
     * allocate no time allocated to real-time tasks.
     */
    CpuRealtimePeriod: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The length of a CPU real-time runtime in microseconds. Set to 0 to
     * allocate no time allocated to real-time tasks.
     */
    CpuRealtimeRuntime: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** CPUs in which to allow execution (e.g., `0-3`, `0,1`). */
    CpusetCpus: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Memory nodes (MEMs) in which to allow execution (0-3, 0,1). Only
     * effective on NUMA systems.
     */
    CpusetMems: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** A list of devices to add to the container. */
    Devices: arraySchema(DeviceMappingSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** A list of cgroup rules to apply to the container */
    DeviceCgroupRules: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** A list of requests for devices to be sent to device drivers. */
    DeviceRequests: arraySchema(DeviceRequestSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Hard limit for kernel TCP buffer memory (in bytes). Depending on the OCI
     * runtime in use, this option may be ignored. It is no longer supported by
     * the default (runc) runtime. This field is omitted when empty.
     */
    KernelMemoryTCP: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Memory soft limit in bytes. */
    MemoryReservation: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Total memory limit (memory + swap). Set as `-1` to enable unlimited swap. */
    MemorySwap: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Tune a container's memory swappiness behavior. Accepts an integer between
     * 0 and 100.
     */
    MemorySwappiness: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** CPU quota in units of 10<sup>-9</sup> CPUs. */
    NanoCpus: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Disable OOM Killer for the container. */
    OomKillDisable: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Run an init inside the container that forwards signals and reaps
     * processes. This field is omitted if empty, and the default (as configured
     * on the daemon) is used.
     */
    Init: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Tune a container's PIDs limit. Set `0` or `-1` for unlimited, or `null`
     * to not change.
     */
    PidsLimit: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * A list of resource limits to set in the container. For example:
     * `{\"Name\": \"nofile\", \"Soft\": 1024, \"Hard\": 2048}`
     */
    Ulimits: arraySchema(ResourcesUlimitsSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The number of usable CPUs (Windows only). On Windows Server containers,
     * the processor resource controls are mutually exclusive. The order of
     * precedence is `CPUCount` first, then `CPUShares`, and `CPUPercent` last.
     */
    CpuCount: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The usable percentage of the available CPUs (Windows only). On Windows
     * Server containers, the processor resource controls are mutually
     * exclusive. The order of precedence is `CPUCount` first, then `CPUShares`,
     * and `CPUPercent` last.
     */
    CpuPercent: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Maximum IOps for the container system drive (Windows only) */
    IOMaximumIOps: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Maximum IO in bytes per second for the container system drive (Windows
     * only).
     */
    IOMaximumBandwidth: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Resources extends Schema.Schema.To<typeof ResourcesSchema> {}

export const SecretSpecSchema = Schema.struct({
    /** User-defined name of the secret. */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** User-defined key/value metadata. */
    Labels: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Base64-url-safe-encoded ([RFC
     * 4648](https://tools.ietf.org/html/rfc4648#section-5)) data to store as
     * secret. This field is only used to _create_ a secret, and is not returned
     * by other endpoints.
     */
    Data: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Driver: DriverSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Templating: DriverSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SecretSpec extends Schema.Schema.To<typeof SecretSpecSchema> {}

/**
 * The status of the service when it is in one of ReplicatedJob or GlobalJob
 * modes. Absent on Replicated and Global mode services. The JobIteration is an
 * ObjectVersion, but unlike the Service's version, does not need to be sent
 * with an update request.
 */
export const ServiceJobStatusSchema = Schema.struct({
    JobIteration: ObjectVersionSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The last time, as observed by the server, that this job was started. */
    LastExecution: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ServiceJobStatus extends Schema.Schema.To<typeof ServiceJobStatusSchema> {}

/** Scheduling mode for the service. */
export const ServiceSpecModeSchema = Schema.struct({
    Replicated: ServiceSpecModeReplicatedSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Global: anySchema.pipe(Schema.nullable).pipe(Schema.optional),
    ReplicatedJob: ServiceSpecModeReplicatedJobSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The mode used for services which run a task to the completed state on
     * each valid node.
     */
    GlobalJob: anySchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ServiceSpecMode extends Schema.Schema.To<typeof ServiceSpecModeSchema> {}

/** CA configuration. */
export const SwarmSpecCAConfigSchema = Schema.struct({
    /** The duration node certificates are issued for. */
    NodeCertExpiry: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Configuration for forwarding signing requests to an external certificate
     * authority.
     */
    ExternalCAs: arraySchema(SwarmSpecCAConfigExternalCAsSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The desired signing CA certificate for all swarm node TLS leaf
     * certificates, in PEM format.
     */
    SigningCACert: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The desired signing CA key for all swarm node TLS leaf certificates, in
     * PEM format.
     */
    SigningCAKey: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * An integer whose purpose is to force swarm to generate a new signing CA
     * certificate and key, if none have been specified in `SigningCACert` and
     * `SigningCAKey`
     */
    ForceRotate: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SwarmSpecCAConfig extends Schema.Schema.To<typeof SwarmSpecCAConfigSchema> {}

/** Defaults for creating tasks in this cluster. */
export const SwarmSpecTaskDefaultsSchema = Schema.struct({
    LogDriver: SwarmSpecTaskDefaultsLogDriverSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SwarmSpecTaskDefaults extends Schema.Schema.To<typeof SwarmSpecTaskDefaultsSchema> {}

/** Response of Engine API: GET "/version" */
export const SystemVersionSchema = Schema.struct({
    Platform: SystemVersionPlatformSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Information about system components */
    Components: arraySchema(SystemVersionComponentsSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** The version of the daemon */
    Version: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The default (and highest) API version that is supported by the daemon */
    ApiVersion: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The minimum API version that is supported by the daemon */
    MinAPIVersion: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The Git commit of the source code that was used to build the daemon */
    GitCommit: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The version Go used to compile the daemon, and the version of the Go
     * runtime in use.
     */
    GoVersion: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The operating system that the daemon is running on ("linux" or "windows") */
    Os: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The architecture that the daemon is running on */
    Arch: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The kernel version (`uname -r`) that the daemon is running on. This field
     * is omitted when empty.
     */
    KernelVersion: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Indicates if the daemon is started with experimental features enabled.
     * This field is omitted when empty / false.
     */
    Experimental: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The date and time that the daemon was compiled. */
    BuildTime: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SystemVersion extends Schema.Schema.To<typeof SystemVersionSchema> {}

export const TaskSpecContainerSpecConfigsSchema = Schema.struct({
    File: TaskSpecContainerSpecFile1Schema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Runtime represents a target that is not mounted into the container but is
     * used by the task **Note**: `Configs.File` and `Configs.Runtime` are
     * mutually exclusive
     */
    Runtime: anySchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** ConfigID represents the ID of the specific config that we're referencing. */
    ConfigID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * ConfigName is the name of the config that this references, but this is
     * just provided for lookup/display purposes. The config in the reference
     * will be identified by its ID.
     */
    ConfigName: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecContainerSpecConfigs extends Schema.Schema.To<typeof TaskSpecContainerSpecConfigsSchema> {}

/** Security options for the container */
export const TaskSpecContainerSpecPrivilegesSchema = Schema.struct({
    CredentialSpec: TaskSpecContainerSpecPrivilegesCredentialSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
    SELinuxContext: TaskSpecContainerSpecPrivilegesSELinuxContextSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecContainerSpecPrivileges
    extends Schema.Schema.To<typeof TaskSpecContainerSpecPrivilegesSchema> {}

export const TaskSpecContainerSpecSecretsSchema = Schema.struct({
    File: TaskSpecContainerSpecFileSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** SecretID represents the ID of the specific secret that we're referencing. */
    SecretID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * SecretName is the name of the secret that this references, but this is
     * just provided for lookup/display purposes. The secret in the reference
     * will be identified by its ID.
     */
    SecretName: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecContainerSpecSecrets extends Schema.Schema.To<typeof TaskSpecContainerSpecSecretsSchema> {}

export const TaskSpecPlacementPreferencesSchema = Schema.struct({
    Spread: TaskSpecPlacementSpreadSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecPlacementPreferences extends Schema.Schema.To<typeof TaskSpecPlacementPreferencesSchema> {}

/**
 * Plugin spec for the service. _(Experimental release only.)_ **Note**:
 * ContainerSpec, NetworkAttachmentSpec, and PluginSpec are mutually exclusive.
 * PluginSpec is only used when the Runtime field is set to `plugin`.
 * NetworkAttachmentSpec is used when the Runtime field is set to `attachment`.
 */
export const TaskSpecPluginSpecSchema = Schema.struct({
    /** The name or 'alias' to use for the plugin. */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The plugin image reference to use. */
    Remote: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Disable the plugin once scheduled. */
    Disabled: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    PluginPrivilege: arraySchema(PluginPrivilegeSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecPluginSpec extends Schema.Schema.To<typeof TaskSpecPluginSpecSchema> {}

export const TaskStatusSchema = Schema.struct({
    Timestamp: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    State: Schema.enums(TaskState).pipe(Schema.nullable).pipe(Schema.optional),
    Message: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Err: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    ContainerStatus: TaskStatusContainerStatusSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskStatus extends Schema.Schema.To<typeof TaskStatusSchema> {}

export enum ClusterVolumeSpecAccessMode_ScopeEnum {
    Single = "single",
    Multi = "multi",
}

export enum ClusterVolumeSpecAccessMode_SharingEnum {
    None = "none",
    Readonly = "readonly",
    Onewriter = "onewriter",
    All = "all",
}

export enum ClusterVolumeSpecAccessMode_AvailabilityEnum {
    Active = "active",
    Pause = "pause",
    Drain = "drain",
}

/** Defines how the volume is used by tasks. */
export const ClusterVolumeSpecAccessModeSchema = Schema.struct({
    /**
     * The set of nodes this volume can be used on at one time.
     *
     * - `single` The volume may only be scheduled to one node at a time.
     * - `multi` the volume may be scheduled to any supported number of nodes at a
     *   time.
     */
    Scope: Schema.enums(ClusterVolumeSpecAccessMode_ScopeEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The number and way that different tasks can use this volume at one time.
     *
     * - `none` The volume may only be used by one task at a time.
     * - `readonly` The volume may be used by any number of tasks, but they all
     *   must mount the volume as readonly
     * - `onewriter` The volume may be used by any number of tasks, but only one
     *   may mount it as read/write.
     * - `all` The volume may have any number of readers and writers.
     */
    Sharing: Schema.enums(ClusterVolumeSpecAccessMode_SharingEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Options for using this volume as a Mount-type volume. Either MountVolume
     * or BlockVolume, but not both, must be present. properties: FsType: type:
     * "string" description: | Specifies the filesystem type for the mount
     * volume. Optional. MountFlags: type: "array" description: | Flags to pass
     * when mounting the volume. Optional. items: type: "string" BlockVolume:
     * type: "object" description: | Options for using this volume as a
     * Block-type volume. Intentionally empty.
     */
    MountVolume: anySchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Swarm Secrets that are passed to the CSI storage plugin when operating on
     * this volume.
     */
    Secrets: arraySchema(ClusterVolumeSpecAccessModeSecretsSchema).pipe(Schema.nullable).pipe(Schema.optional),
    AccessibilityRequirements: ClusterVolumeSpecAccessModeAccessibilityRequirementsSchema.pipe(Schema.nullable).pipe(
        Schema.optional
    ),
    CapacityRange: ClusterVolumeSpecAccessModeCapacityRangeSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The availability of the volume for use in tasks.
     *
     * - `active` The volume is fully available for scheduling on the cluster
     * - `pause` No new workloads should use the volume, but existing workloads
     *   are not stopped.
     * - `drain` All workloads using this volume should be stopped and
     *   rescheduled, and no new ones should be started.
     */
    Availability: Schema.enums(ClusterVolumeSpecAccessMode_AvailabilityEnum)
        .pipe(Schema.nullable)
        .pipe(Schema.optional),
});

export interface ClusterVolumeSpecAccessMode extends Schema.Schema.To<typeof ClusterVolumeSpecAccessModeSchema> {}

export const ConfigSchema = Schema.struct({
    ID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Version: ObjectVersionSchema.pipe(Schema.nullable).pipe(Schema.optional),
    CreatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    UpdatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Spec: ConfigSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Config extends Schema.Schema.To<typeof ConfigSchema> {}

export const ConfigsCreateBodySchema = ConfigSpecSchema;

export interface ConfigsCreateBody extends Schema.Schema.To<typeof ConfigsCreateBodySchema> {}

export enum ContainerState_StatusEnum {
    Created = "created",
    Running = "running",
    Paused = "paused",
    Restarting = "restarting",
    Removing = "removing",
    Exited = "exited",
    Dead = "dead",
}

/**
 * ContainerState stores container's running state. It's part of
 * ContainerJSONBase and will be returned by the "inspect" command.
 */
export const ContainerStateSchema = Schema.struct({
    /**
     * String representation of the container state. Can be one of "created",
     * "running", "paused", "restarting", "removing", "exited", or "dead".
     */
    Status: Schema.enums(ContainerState_StatusEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Whether this container is running. Note that a running container can be
     * _paused_. The `Running` and `Paused` booleans are not mutually exclusive:
     * When pausing a container (on Linux), the freezer cgroup is used to
     * suspend all processes in the container. Freezing the process requires the
     * process to be running. As a result, paused containers are both `Running`
     * _and_ `Paused`. Use the `Status` field instead to determine if a
     * container's state is "running".
     */
    Running: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Whether this container is paused. */
    Paused: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Whether this container is restarting. */
    Restarting: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Whether a process within this container has been killed because it ran
     * out of memory since the container was last started.
     */
    OOMKilled: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Dead: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The process ID of this container */
    Pid: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The last exit code of this container */
    ExitCode: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Error: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The time when this container was last started. */
    StartedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The time when this container last exited. */
    FinishedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Health: HealthSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ContainerState extends Schema.Schema.To<typeof ContainerStateSchema> {}

/** A summary of the container's network settings */
export const ContainerSummaryNetworkSettingsSchema = Schema.struct({
    Networks: recordSchema(stringSchema, EndpointSettingsSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ContainerSummaryNetworkSettings
    extends Schema.Schema.To<typeof ContainerSummaryNetworkSettingsSchema> {}

export const IdUpdateBodySchema = Schema.extend(
    ResourcesSchema,
    Schema.struct({
        RestartPolicy: RestartPolicySchema.pipe(Schema.nullable).pipe(Schema.optional),
    })
);

export interface IdUpdateBody extends Schema.Schema.To<typeof IdUpdateBodySchema> {}

/** Information about an image in the local image cache. */
export const ImageInspectSchema = Schema.struct({
    /**
     * ID is the content-addressable ID of an image. This identifier is a
     * content-addressable digest calculated from the image's configuration
     * (which includes the digests of layers used by the image). Note that this
     * digest differs from the `RepoDigests` below, which holds digests of image
     * manifests that reference the image.
     */
    Id: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * List of image names/tags in the local image cache that reference this
     * image. Multiple image tags can refer to the same image, and this list may
     * be empty if no tags reference the image, in which case the image is
     * "untagged", in which case it can still be referenced by its ID.
     */
    RepoTags: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * List of content-addressable digests of locally available image manifests
     * that the image is referenced from. Multiple manifests can refer to the
     * same image. These digests are usually only available if the image was
     * either pulled from a registry, or if the image was pushed to a registry,
     * which is when the manifest is generated and its digest calculated.
     */
    RepoDigests: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * ID of the parent image. Depending on how the image was created, this
     * field may be empty and is only set for images that were built/created
     * locally. This field is empty if the image was pulled from an image
     * registry.
     */
    Parent: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Optional message that was set when committing or importing the image. */
    Comment: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Date and time at which the image was created, formatted in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    Created: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The ID of the container that was used to create the image. Depending on
     * how the image was created, this field may be empty.
     */
    Container: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    ContainerConfig: ContainerConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The version of Docker that was used to build the image. Depending on how
     * the image was created, this field may be empty.
     */
    DockerVersion: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Name of the author that was specified when committing the image, or as
     * specified through MAINTAINER (deprecated) in the Dockerfile.
     */
    Author: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Config: ContainerConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Hardware CPU architecture that the image runs on. */
    Architecture: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** CPU architecture variant (presently ARM-only). */
    Variant: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Operating System the image is built to run on. */
    Os: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Operating System version the image is built to run on (especially for
     * Windows).
     */
    OsVersion: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Total size of the image including all layers it is composed of. */
    Size: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Total size of the image including all layers it is composed of. In
     * versions of Docker before v1.10, this field was calculated from the image
     * itself and all of its parent images. Images are now stored
     * self-contained, and no longer use a parent-chain, making this field an
     * equivalent of the Size field. **Deprecated**: this field is kept for
     * backward compatibility, but will be removed in API v1.44.
     */
    VirtualSize: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    GraphDriver: GraphDriverDataSchema.pipe(Schema.nullable).pipe(Schema.optional),
    RootFS: ImageInspectRootFSSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Metadata: ImageInspectMetadataSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ImageInspect extends Schema.Schema.To<typeof ImageInspectSchema> {}

export enum Mount_TypeEnum {
    Bind = "bind",
    Volume = "volume",
    Tmpfs = "tmpfs",
    Npipe = "npipe",
    Cluster = "cluster",
}

export const MountSchema = Schema.struct({
    /** Container path. */
    Target: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Mount source (e.g. a volume name, a host path). */
    Source: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
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
    Type: Schema.enums(Mount_TypeEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /** Whether the mount should be read-only. */
    ReadOnly: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The consistency requirement for the mount: `default`, `consistent`,
     * `cached`, or `delegated`.
     */
    Consistency: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    BindOptions: MountBindOptionsSchema.pipe(Schema.nullable).pipe(Schema.optional),
    VolumeOptions: MountVolumeOptionsSchema.pipe(Schema.nullable).pipe(Schema.optional),
    TmpfsOptions: MountTmpfsOptionsSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Mount extends Schema.Schema.To<typeof MountSchema> {}

export const NetworkSchema = Schema.struct({
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Id: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Created: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Scope: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Driver: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    EnableIPv6: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    IPAM: IPAMSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Internal: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Attachable: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Ingress: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Containers: recordSchema(stringSchema, NetworkContainerSchema).pipe(Schema.nullable).pipe(Schema.optional),
    Options: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    Labels: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Network extends Schema.Schema.To<typeof NetworkSchema> {}

export const NetworkConnectRequestSchema = Schema.struct({
    /** The ID or name of the container to connect to the network. */
    Container: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    EndpointConfig: EndpointSettingsSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface NetworkConnectRequest extends Schema.Schema.To<typeof NetworkConnectRequestSchema> {}

export const NetworkCreateRequestSchema = Schema.struct({
    /** The network's name. */
    Name: stringSchema,
    /**
     * Check for networks with duplicate names. Since Network is primarily keyed
     * based on a random ID and not on the name, and network name is strictly a
     * user-friendly alias to the network which is uniquely identified using ID,
     * there is no guaranteed way to check for duplicates. CheckDuplicate is
     * there to provide a best effort checking of any networks which has the
     * same name but it is not guaranteed to catch all name collisions.
     */
    CheckDuplicate: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Name of the network driver plugin to use. */
    Driver: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Restrict external access to the network. */
    Internal: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Globally scoped network is manually attachable by regular containers from
     * workers in swarm mode.
     */
    Attachable: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Ingress network is the network which provides the routing-mesh in swarm
     * mode.
     */
    Ingress: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    IPAM: IPAMSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Enable IPv6 on the network. */
    EnableIPv6: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Network specific options to be used by the drivers. */
    Options: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** User-defined key/value metadata. */
    Labels: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface NetworkCreateRequest extends Schema.Schema.To<typeof NetworkCreateRequestSchema> {}

/** NetworkSettings exposes the network settings in the API */
export const NetworkSettingsSchema = Schema.struct({
    /** Name of the network's bridge (for example, `docker0`). */
    Bridge: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** SandboxID uniquely represents a container's network stack. */
    SandboxID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Indicates if hairpin NAT should be enabled on the virtual interface. */
    HairpinMode: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** IPv6 unicast address using the link-local prefix. */
    LinkLocalIPv6Address: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Prefix length of the IPv6 unicast address. */
    LinkLocalIPv6PrefixLen: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Ports: PortMapSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** SandboxKey identifies the sandbox */
    SandboxKey: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    SecondaryIPAddresses: arraySchema(AddressSchema).pipe(Schema.nullable).pipe(Schema.optional),
    SecondaryIPv6Addresses: arraySchema(AddressSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * EndpointID uniquely represents a service endpoint in a Sandbox.
     * **Deprecated**: This field is only propagated when attached to the >
     * default "bridge" network. Use the information from the "bridge" network
     * inside the `Networks` map instead, which contains the same information.
     * This field was deprecated in Docker 1.9 and is scheduled to be removed in
     * Docker 17.12.0
     */
    EndpointID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Gateway address for the default "bridge" network. **Deprecated**: This
     * field is only propagated when attached to the default "bridge" network.
     * Use the information from the "bridge" network inside the `Networks` map
     * instead, which contains the same information. This field was deprecated
     * in Docker 1.9 and is scheduled to be removed in Docker 17.12.0
     */
    Gateway: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Global IPv6 address for the default "bridge" network. **Deprecated**:
     * This field is only propagated when attached to the default "bridge"
     * network. Use the information from the "bridge" network inside the
     * `Networks` map instead, which contains the same information. This field
     * was deprecated in Docker 1.9 and is scheduled to be removed in Docker
     * 17.12.0
     */
    GlobalIPv6Address: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Mask length of the global IPv6 address. **Deprecated**: This field is
     * only propagated when attached to the default "bridge" network. Use the
     * information from the "bridge" network inside the `Networks` map instead,
     * which contains the same information. This field was deprecated in Docker
     * 1.9 and is scheduled to be removed in Docker 17.12.0
     */
    GlobalIPv6PrefixLen: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * IPv4 address for the default "bridge" network. **Deprecated**: This field
     * is only propagated when attached to the default "bridge" network. Use the
     * information from the "bridge" network inside the `Networks` map instead,
     * which contains the same information. This field was deprecated in Docker
     * 1.9 and is scheduled to be removed in Docker 17.12.0
     */
    IPAddress: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Mask length of the IPv4 address. **Deprecated**: This field is only
     * propagated when attached to the default "bridge" network. Use the
     * information from the "bridge" network inside the `Networks` map instead,
     * which contains the same information. This field was deprecated in Docker
     * 1.9 and is scheduled to be removed in Docker 17.12.0
     */
    IPPrefixLen: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * IPv6 gateway address for this network. **Deprecated**: This field is only
     * propagated when attached to the default "bridge" network. Use the
     * information from the "bridge" network inside the `Networks` map instead,
     * which contains the same information. This field was deprecated in Docker
     * 1.9 and is scheduled to be removed in Docker 17.12.0
     */
    IPv6Gateway: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * MAC address for the container on the default "bridge" network.
     * **Deprecated**: This field is only propagated when attached to the >
     * default "bridge" network. Use the information from the "bridge" network
     * inside the `Networks` map instead, which contains the same information.
     * This field was deprecated in Docker 1.9 and is scheduled to be removed in
     * Docker 17.12.0
     */
    MacAddress: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Information about all networks that the container is connected to. */
    Networks: recordSchema(stringSchema, EndpointSettingsSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface NetworkSettings extends Schema.Schema.To<typeof NetworkSettingsSchema> {}

/**
 * NetworkingConfig represents the container's networking configuration for each
 * of its interfaces. It is used for the networking configs specified in the
 * `docker create` and `docker network connect` commands.
 */
export const NetworkingConfigSchema = Schema.struct({
    /** A mapping of network name to endpoint configuration for that network. */
    EndpointsConfig: recordSchema(stringSchema, EndpointSettingsSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface NetworkingConfig extends Schema.Schema.To<typeof NetworkingConfigSchema> {}

/** The config of a plugin. */
export const PluginConfigSchema = Schema.struct({
    /** Docker Version used to create the plugin */
    DockerVersion: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Description: stringSchema,
    Documentation: stringSchema,
    _Interface: PluginConfigInterfaceSchema,
    Entrypoint: arraySchema(stringSchema),
    WorkDir: stringSchema,
    User: PluginConfigUserSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Network: PluginConfigNetworkSchema,
    Linux: PluginConfigLinuxSchema,
    PropagatedMount: stringSchema,
    IpcHost: booleanSchema,
    PidHost: booleanSchema,
    Mounts: arraySchema(PluginMountSchema),
    Env: arraySchema(PluginEnvSchema),
    Args: PluginConfigArgsSchema,
    rootfs: PluginConfigRootfsSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface PluginConfig extends Schema.Schema.To<typeof PluginConfigSchema> {}

/**
 * An object describing the resources which can be advertised by a node and
 * requested by a task.
 */
export const ResourceObjectSchema = Schema.struct({
    NanoCPUs: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    MemoryBytes: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    GenericResources: GenericResourcesSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ResourceObject extends Schema.Schema.To<typeof ResourceObjectSchema> {}

export const SecretSchema = Schema.struct({
    ID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Version: ObjectVersionSchema.pipe(Schema.nullable).pipe(Schema.optional),
    CreatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    UpdatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Spec: SecretSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Secret extends Schema.Schema.To<typeof SecretSchema> {}

export const SecretsCreateBodySchema = SecretSpecSchema;

export interface SecretsCreateBody extends Schema.Schema.To<typeof SecretsCreateBodySchema> {}

export const ServiceEndpointSchema = Schema.struct({
    Spec: EndpointSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Ports: arraySchema(EndpointPortConfigSchema).pipe(Schema.nullable).pipe(Schema.optional),
    VirtualIPs: arraySchema(ServiceEndpointVirtualIPsSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ServiceEndpoint extends Schema.Schema.To<typeof ServiceEndpointSchema> {}

/** User modifiable swarm configuration. */
export const SwarmSpecSchema = Schema.struct({
    /** Name of the swarm. */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** User-defined key/value metadata. */
    Labels: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    Orchestration: SwarmSpecOrchestrationSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Raft: SwarmSpecRaftSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Dispatcher: SwarmSpecDispatcherSchema.pipe(Schema.nullable).pipe(Schema.optional),
    CAConfig: SwarmSpecCAConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    EncryptionConfig: SwarmSpecEncryptionConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    TaskDefaults: SwarmSpecTaskDefaultsSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SwarmSpec extends Schema.Schema.To<typeof SwarmSpecSchema> {}

export const TaskSpecPlacementSchema = Schema.struct({
    /**
     * An array of constraint expressions to limit the set of nodes where a task
     * can be scheduled. Constraint expressions can either use a _match_ (`==`)
     * or _exclude_ (`!=`) rule. Multiple constraints find nodes that satisfy
     * every expression (AND match). Constraints can match node or Docker Engine
     * labels as follows: node attribute | matches | example
     * ---------------------|--------------------------------|-----------------------------------------------
     * `node.id` | Node ID | `node.id==2ivku8v2gvtg4` `node.hostname` | Node
     * hostname | `node.hostname!=node-2` `node.role` | Node role
     * (`manager`/`worker`) | `node.role==manager` `node.platform.os` | Node
     * operating system | `node.platform.os==windows` `node.platform.arch` |
     * Node architecture | `node.platform.arch==x86_64` `node.labels` |
     * User-defined node labels | `node.labels.security==high` `engine.labels` |
     * Docker Engine's labels | `engine.labels.operatingsystem==ubuntu-14.04`
     * `engine.labels` apply to Docker Engine labels like operating system,
     * drivers, etc. Swarm administrators add `node.labels` for operational
     * purposes by using the [`node update endpoint`](#operation/NodeUpdate).
     */
    Constraints: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Preferences provide a way to make the scheduler aware of factors such as
     * topology. They are provided in order from highest to lowest precedence.
     */
    Preferences: arraySchema(TaskSpecPlacementPreferencesSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Maximum number of replicas for per node (default value is 0, which is
     * unlimited)
     */
    MaxReplicas: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Platforms stores all the platforms that the service's image can run on.
     * This field is used in the platform filter for scheduling. If empty, then
     * the platform filter is off, meaning there are no scheduling
     * restrictions.
     */
    Platforms: arraySchema(PlatformSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecPlacement extends Schema.Schema.To<typeof TaskSpecPlacementSchema> {}

/**
 * ClusterInfo represents information about the swarm as is returned by the
 * "/info" endpoint. Join-tokens are not included.
 */
export const ClusterInfoSchema = Schema.struct({
    /** The ID of the swarm. */
    ID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Version: ObjectVersionSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Date and time at which the swarm was initialized in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    CreatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Date and time at which the swarm was last updated in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    UpdatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Spec: SwarmSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
    TLSInfo: TLSInfoSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Whether there is currently a root CA rotation in progress for the swarm */
    RootRotationInProgress: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * DataPathPort specifies the data path port number for data traffic.
     * Acceptable port range is 1024 to 49151. If no port is set or is set to 0,
     * the default port (4789) is used.
     */
    DataPathPort: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Default Address Pool specifies default subnet pools for global scope
     * networks.
     */
    DefaultAddrPool: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * SubnetSize specifies the subnet size of the networks created from the
     * default subnet pool.
     */
    SubnetSize: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ClusterInfo extends Schema.Schema.To<typeof ClusterInfoSchema> {}

/** Cluster-specific options used to create the volume. */
export const ClusterVolumeSpecSchema = Schema.struct({
    /**
     * Group defines the volume group of this volume. Volumes belonging to the
     * same group can be referred to by group name when creating Services.
     * Referring to a volume by group instructs Swarm to treat volumes in that
     * group interchangeably for the purpose of scheduling. Volumes with an
     * empty string for a group technically all belong to the same, emptystring
     * group.
     */
    Group: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    AccessMode: ClusterVolumeSpecAccessModeSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ClusterVolumeSpec extends Schema.Schema.To<typeof ClusterVolumeSpecSchema> {}

export const ContainerSummarySchema = Schema.struct({
    /** The ID of this container */
    Id: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The names that this container has been given */
    Names: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** The name of the image used when creating this container */
    Image: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The ID of the image that this container was created from */
    ImageID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Command to run when starting the container */
    Command: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** When the container was created */
    Created: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The ports exposed by this container */
    Ports: arraySchema(PortSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** The size of files that have been created or changed by this container */
    SizeRw: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The total size of all the files in this container */
    SizeRootFs: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** User-defined key/value metadata. */
    Labels: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** The state of this container (e.g. `Exited`) */
    State: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Additional human-readable status of this container (e.g. `Exit 0`) */
    Status: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    HostConfig: ContainerSummaryHostConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    NetworkSettings: ContainerSummaryNetworkSettingsSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Mounts: arraySchema(MountPointSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ContainerSummary extends Schema.Schema.To<typeof ContainerSummarySchema> {}

export enum HostConfig_CgroupnsModeEnum {
    Private = "private",
    Host = "host",
}

export enum HostConfig_IsolationEnum {
    Default = "default",
    Process = "process",
    Hyperv = "hyperv",
}

/** Container configuration that depends on the host we are running on */
export const HostConfigSchema = Schema.extend(
    ResourcesSchema,
    Schema.struct({
        /**
         * A list of volume bindings for this container. Each volume binding is
         * a string in one of these forms:
         *
         * - `host-src:container-dest[:options]` to bind-mount a host path into
         *   the container. Both `host-src`, and `container-dest` must be an
         *   _absolute_ path.
         * - `volume-name:container-dest[:options]` to bind-mount a volume managed
         *   by a volume driver into the container. `container-dest` must be an
         *   _absolute_ path. `options` is an optional, comma-delimited list
         *   of:
         * - `nocopy` disables automatic copying of data from the container path
         *   to the volume. The `nocopy` flag only applies to named volumes.
         * - `[ro|rw]` mounts a volume read-only or read-write, respectively. If
         *   omitted or set to `rw`, volumes are mounted read-write.
         * - `[z|Z]` applies SELinux labels to allow or deny multiple containers
         *   to read and write to the same volume.
         * - `z`: a _shared_ content label is applied to the content. This label
         *   indicates that multiple containers can share the volume content,
         *   for both reading and writing.
         * - `Z`: a _private unshared_ label is applied to the content. This label
         *   indicates that only the current container can use a private volume.
         *   Labeling systems such as SELinux require proper labels to be placed
         *   on volume content that is mounted into a container. Without a
         *   label, the security system can prevent a container's processes from
         *   using the content. By default, the labels set by the host operating
         *   system are not modified.
         * - `[[r]shared|[r]slave|[r]private]` specifies mount [propagation
         *   behavior](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt).
         *   This only applies to bind-mounted volumes, not internal volumes or
         *   named volumes. Mount propagation requires the source mount point
         *   (the location where the source directory is mounted in the host
         *   operating system) to have the correct propagation properties. For
         *   shared volumes, the source mount point must be set to `shared`. For
         *   slave volumes, the mount must be set to either `shared` or
         *   `slave`.
         */
        Binds: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /** Path to a file where the container ID is written */
        ContainerIDFile: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
        LogConfig: HostConfigLogConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * Network mode to use for this container. Supported standard values
         * are: `bridge`, `host`, `none`, and `container:<name|id>`. Any other
         * value is taken as a custom network's name to which this container
         * should connect to.
         */
        NetworkMode: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
        PortBindings: PortMapSchema.pipe(Schema.nullable).pipe(Schema.optional),
        RestartPolicy: RestartPolicySchema.pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * Automatically remove the container when the container's process
         * exits. This has no effect if `RestartPolicy` is set.
         */
        AutoRemove: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
        /** Driver that this container uses to mount volumes. */
        VolumeDriver: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * A list of volumes to inherit from another container, specified in the
         * form `<container name>[:<ro|rw>]`.
         */
        VolumesFrom: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /** Specification for mounts to be added to the container. */
        Mounts: arraySchema(MountSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /** Initial console size, as an `[height, width]` array. */
        ConsoleSize: arraySchema(numberSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * Arbitrary non-identifying metadata attached to container and provided
         * to the runtime when the container is started.
         */
        Annotations: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * A list of kernel capabilities to add to the container. Conflicts with
         * option 'Capabilities'.
         */
        CapAdd: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * A list of kernel capabilities to drop from the container. Conflicts
         * with option 'Capabilities'.
         */
        CapDrop: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * Cgroup namespace mode for the container. Possible values are: -
         * `\"private\"`: the container runs in its own private cgroup
         * namespace
         *
         * - `\"host\"`: use the host system's cgroup namespace If not specified,
         *   the daemon default is used, which can either be `\"private\"` or
         *   `\"host\"`, depending on daemon version, kernel support and
         *   configuration.
         */
        CgroupnsMode: Schema.enums(HostConfig_CgroupnsModeEnum).pipe(Schema.nullable).pipe(Schema.optional),
        /** A list of DNS servers for the container to use. */
        Dns: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /** A list of DNS options. */
        DnsOptions: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /** A list of DNS search domains. */
        DnsSearch: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * A list of hostnames/IP mappings to add to the container's
         * `/etc/hosts` file. Specified in the form `[\"hostname:IP\"]`.
         */
        ExtraHosts: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /** A list of additional groups that the container process will run as. */
        GroupAdd: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * IPC sharing mode for the container. Possible values are: -
         * `\"none\"`: own private IPC namespace, with /dev/shm not mounted -
         * `\"private\"`: own private IPC namespace
         *
         * - `\"shareable\"`: own private IPC namespace, with a possibility to
         *   share it with other containers
         * - `\"container:<name|id>\"`: join another (shareable) container's IPC
         *   namespace
         * - `\"host\"`: use the host system's IPC namespace If not specified,
         *   daemon default is used, which can either be `\"private\"` or
         *   `\"shareable\"`, depending on daemon version and configuration.
         */
        IpcMode: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
        /** Cgroup to use for the container. */
        Cgroup: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
        /** A list of links for the container in the form `container_name:alias`. */
        Links: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * An integer value containing the score given to the container in order
         * to tune OOM killer preferences.
         */
        OomScoreAdj: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * Set the PID (Process) Namespace mode for the container. It can be
         * either:
         *
         * - `\"container:<name|id>\"`: joins another container's PID namespace
         * - `\"host\"`: use the host's PID namespace inside the container
         */
        PidMode: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
        /** Gives the container full access to the host. */
        Privileged: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * Allocates an ephemeral host port for all of a container's exposed
         * ports. Ports are de-allocated when the container stops and allocated
         * when the container starts. The allocated port might be changed when
         * restarting the container. The port is selected from the ephemeral
         * port range that depends on the kernel. For example, on Linux the
         * range is defined by `/proc/sys/net/ipv4/ip_local_port_range`.
         */
        PublishAllPorts: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
        /** Mount the container's root filesystem as read only. */
        ReadonlyRootfs: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * A list of string values to customize labels for MLS systems, such as
         * SELinux.
         */
        SecurityOpt: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * Storage driver options for this container, in the form `{\"size\":
         * \"120G\"}`.
         */
        StorageOpt: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * A map of container directories which should be replaced by tmpfs
         * mounts, and their corresponding mount options. For example: `{
         * \"/run\": \"rw,noexec,nosuid,size=65536k\" }`
         */
        Tmpfs: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /** UTS namespace to use for the container. */
        UTSMode: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * Sets the usernamespace mode for the container when usernamespace
         * remapping option is enabled.
         */
        UsernsMode: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
        /** Size of `/dev/shm` in bytes. If omitted, the system uses 64MB. */
        ShmSize: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * A list of kernel parameters (sysctls) to set in the container. For
         * example: `{\"net.ipv4.ip_forward\": \"1\"}`
         */
        Sysctls: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /** Runtime to use with this container. */
        Runtime: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
        /** Isolation technology of the container. (Windows only) */
        Isolation: Schema.string
            .pipe(
                Schema.transform(
                    Schema.enums(HostConfig_IsolationEnum).pipe(Schema.nullable),
                    (a: string) =>
                        // eslint-disable-next-line unicorn/no-null
                        a === "" ? null : HostConfig_IsolationEnum[a as keyof typeof HostConfig_IsolationEnum],
                    String
                )
            )
            .pipe(Schema.optional),
        /**
         * The list of paths to be masked inside the container (this overrides
         * the default set of paths).
         */
        MaskedPaths: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
        /**
         * The list of paths to be set as read-only inside the container (this
         * overrides the default set of paths).
         */
        ReadonlyPaths: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    })
);

export interface HostConfig extends Schema.Schema.To<typeof HostConfigSchema> {}

/**
 * NodeDescription encapsulates the properties of the Node as reported by the
 * agent.
 */
export const NodeDescriptionSchema = Schema.struct({
    Hostname: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Platform: PlatformSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Resources: ResourceObjectSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Engine: EngineDescriptionSchema.pipe(Schema.nullable).pipe(Schema.optional),
    TLSInfo: TLSInfoSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface NodeDescription extends Schema.Schema.To<typeof NodeDescriptionSchema> {}

/** A plugin for the Engine API */
export const PluginSchema = Schema.struct({
    Id: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Name: stringSchema,
    /**
     * True if the plugin is running. False if the plugin is not running, only
     * installed.
     */
    Enabled: booleanSchema,
    Settings: PluginSettingsSchema,
    /** Plugin remote reference used to push/pull the plugin */
    PluginReference: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Config: PluginConfigSchema,
});

export interface Plugin extends Schema.Schema.To<typeof PluginSchema> {}

export const SwarmInitRequestSchema = Schema.struct({
    /**
     * Listen address used for inter-manager communication, as well as
     * determining the networking interface used for the VXLAN Tunnel Endpoint
     * (VTEP). This can either be an address/port combination in the form
     * `192.168.1.1:4567`, or an interface followed by a port number, like
     * `eth0:4567`. If the port number is omitted, the default swarm listening
     * port is used.
     */
    ListenAddr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Externally reachable address advertised to other nodes. This can either
     * be an address/port combination in the form `192.168.1.1:4567`, or an
     * interface followed by a port number, like `eth0:4567`. If the port number
     * is omitted, the port number from the listen address is used. If
     * `AdvertiseAddr` is not specified, it will be automatically detected when
     * possible.
     */
    AdvertiseAddr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Address or interface to use for data path traffic (format:
     * `<ip|interface>`), for example, `192.168.1.1`, or an interface, like
     * `eth0`. If `DataPathAddr` is unspecified, the same address as
     * `AdvertiseAddr` is used. The `DataPathAddr` specifies the address that
     * global scope network drivers will publish towards other nodes in order to
     * reach the containers running on this node. Using this parameter it is
     * possible to separate the container data traffic from the management
     * traffic of the cluster.
     */
    DataPathAddr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * DataPathPort specifies the data path port number for data traffic.
     * Acceptable port range is 1024 to 49151. if no port is set or is set to 0,
     * default port 4789 will be used.
     */
    DataPathPort: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Default Address Pool specifies default subnet pools for global scope
     * networks.
     */
    DefaultAddrPool: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Force creation of a new swarm. */
    ForceNewCluster: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * SubnetSize specifies the subnet size of the networks created from the
     * default subnet pool.
     */
    SubnetSize: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Spec: SwarmSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SwarmInitRequest extends Schema.Schema.To<typeof SwarmInitRequestSchema> {}

export const SwarmInitRequest1Schema = Schema.struct({
    /**
     * Listen address used for inter-manager communication, as well as
     * determining the networking interface used for the VXLAN Tunnel Endpoint
     * (VTEP). This can either be an address/port combination in the form
     * `192.168.1.1:4567`, or an interface followed by a port number, like
     * `eth0:4567`. If the port number is omitted, the default swarm listening
     * port is used.
     */
    ListenAddr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Externally reachable address advertised to other nodes. This can either
     * be an address/port combination in the form `192.168.1.1:4567`, or an
     * interface followed by a port number, like `eth0:4567`. If the port number
     * is omitted, the port number from the listen address is used. If
     * `AdvertiseAddr` is not specified, it will be automatically detected when
     * possible.
     */
    AdvertiseAddr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Address or interface to use for data path traffic (format:
     * `<ip|interface>`), for example, `192.168.1.1`, or an interface, like
     * `eth0`. If `DataPathAddr` is unspecified, the same address as
     * `AdvertiseAddr` is used. The `DataPathAddr` specifies the address that
     * global scope network drivers will publish towards other nodes in order to
     * reach the containers running on this node. Using this parameter it is
     * possible to separate the container data traffic from the management
     * traffic of the cluster.
     */
    DataPathAddr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * DataPathPort specifies the data path port number for data traffic.
     * Acceptable port range is 1024 to 49151. if no port is set or is set to 0,
     * default port 4789 will be used.
     */
    DataPathPort: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Default Address Pool specifies default subnet pools for global scope
     * networks.
     */
    DefaultAddrPool: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Force creation of a new swarm. */
    ForceNewCluster: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * SubnetSize specifies the subnet size of the networks created from the
     * default subnet pool.
     */
    SubnetSize: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Spec: SwarmSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SwarmInitRequest1 extends Schema.Schema.To<typeof SwarmInitRequest1Schema> {}

export enum TaskSpecContainerSpec_IsolationEnum {
    Default = "default",
    Process = "process",
    Hyperv = "hyperv",
}

/**
 * Container spec for the service. **Note**: ContainerSpec,
 * NetworkAttachmentSpec, and PluginSpec are mutually exclusive. PluginSpec is
 * only used when the Runtime field is set to `plugin`. NetworkAttachmentSpec is
 * used when the Runtime field is set to `attachment`.
 */
export const TaskSpecContainerSpecSchema = Schema.struct({
    /** The image name to use for the container */
    Image: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** User-defined key/value data. */
    Labels: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** The command to be run in the image. */
    Command: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Arguments to the command. */
    Args: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The hostname to use for the container, as a valid [RFC
     * 1123](https://tools.ietf.org/html/rfc1123) hostname.
     */
    Hostname: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** A list of environment variables in the form `VAR=value`. */
    Env: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** The working directory for commands to run in. */
    Dir: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The user inside the container. */
    User: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** A list of additional groups that the container process will run as. */
    Groups: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    Privileges: TaskSpecContainerSpecPrivilegesSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Whether a pseudo-TTY should be allocated. */
    TTY: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Open `stdin` */
    OpenStdin: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Mount the container's root filesystem as read only. */
    ReadOnly: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Specification for mounts to be added to containers created as part of the
     * service.
     */
    Mounts: arraySchema(MountSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Signal to stop the container. */
    StopSignal: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Amount of time to wait for the container to terminate before forcefully
     * killing it.
     */
    StopGracePeriod: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    HealthCheck: HealthConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * A list of hostname/IP mappings to add to the container's `hosts` file.
     * The format of extra hosts is specified in the
     * [hosts(5)](http://man7.org/linux/man-pages/man5/hosts.5.html) man page:
     * IP_address canonical_hostname [aliases...]
     */
    Hosts: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    DNSConfig: TaskSpecContainerSpecDNSConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Secrets contains references to zero or more secrets that will be exposed
     * to the service.
     */
    Secrets: arraySchema(TaskSpecContainerSpecSecretsSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Configs contains references to zero or more configs that will be exposed
     * to the service.
     */
    Configs: arraySchema(TaskSpecContainerSpecConfigsSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Isolation technology of the containers running the service. (Windows
     * only)
     */
    Isolation: Schema.enums(TaskSpecContainerSpec_IsolationEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Run an init inside the container that forwards signals and reaps
     * processes. This field is omitted if empty, and the default (as configured
     * on the daemon) is used.
     */
    Init: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Set kernel namedspaced parameters (sysctls) in the container. The Sysctls
     * option on services accepts the same sysctls as the are supported on
     * containers. Note that while the same sysctls are supported, no guarantees
     * or checks are made about their suitability for a clustered environment,
     * and it's up to the user to determine whether a given sysctl will work
     * properly in a Service.
     */
    Sysctls: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * A list of kernel capabilities to add to the default set for the
     * container.
     */
    CapabilityAdd: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * A list of kernel capabilities to drop from the default set for the
     * container.
     */
    CapabilityDrop: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * A list of resource limits to set in the container. For example:
     * `{\"Name\": \"nofile\", \"Soft\": 1024, \"Hard\": 2048}`"
     */
    Ulimits: arraySchema(ResourcesUlimitsSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecContainerSpec extends Schema.Schema.To<typeof TaskSpecContainerSpecSchema> {}

/**
 * Resource requirements which apply to each individual container created as
 * part of the service.
 */
export const TaskSpecResourcesSchema = Schema.struct({
    Limits: LimitSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Reservations: ResourceObjectSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpecResources extends Schema.Schema.To<typeof TaskSpecResourcesSchema> {}

/**
 * Options and information specific to, and only present on, Swarm CSI cluster
 * volumes.
 */
export const ClusterVolumeSchema = Schema.struct({
    /**
     * The Swarm ID of this volume. Because cluster volumes are Swarm objects,
     * they have an ID, unlike non-cluster volumes. This ID can be used to refer
     * to the Volume instead of the name.
     */
    ID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Version: ObjectVersionSchema.pipe(Schema.nullable).pipe(Schema.optional),
    CreatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    UpdatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Spec: ClusterVolumeSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Info: ClusterVolumeInfoSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The status of the volume as it pertains to its publishing and use on
     * specific nodes
     */
    PublishStatus: arraySchema(ClusterVolumePublishStatusSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ClusterVolume extends Schema.Schema.To<typeof ClusterVolumeSchema> {}

export const ContainerInspectResponseSchema = Schema.struct({
    /** The ID of the container */
    Id: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The time the container was created */
    Created: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The path to the command being run */
    Path: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The arguments to the command being run */
    Args: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    State: ContainerStateSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The container's image ID */
    Image: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    ResolvConfPath: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    HostnamePath: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    HostsPath: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    LogPath: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    RestartCount: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Driver: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Platform: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    MountLabel: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    ProcessLabel: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    AppArmorProfile: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** IDs of exec instances that are running in the container. */
    ExecIDs: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    HostConfig: HostConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    GraphDriver: GraphDriverDataSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The size of files that have been created or changed by this container. */
    SizeRw: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The total size of all the files in this container. */
    SizeRootFs: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Mounts: arraySchema(MountPointSchema).pipe(Schema.nullable).pipe(Schema.optional),
    Config: ContainerConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    NetworkSettings: NetworkSettingsSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ContainerInspectResponse extends Schema.Schema.To<typeof ContainerInspectResponseSchema> {}

export const ContainersCreateBodySchema = Schema.extend(
    ContainerConfigSchema,
    Schema.struct({
        HostConfig: HostConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
        NetworkingConfig: NetworkingConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    })
);

export interface ContainersCreateBody extends Schema.Schema.To<typeof ContainersCreateBodySchema> {}

export const ContainersCreateBody1Schema = Schema.extend(
    ContainerConfigSchema,
    Schema.struct({
        HostConfig: HostConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
        NetworkingConfig: NetworkingConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    })
);

export interface ContainersCreateBody1 extends Schema.Schema.To<typeof ContainersCreateBody1Schema> {}

export const NodeSchema = Schema.struct({
    ID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Version: ObjectVersionSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Date and time at which the node was added to the swarm in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    CreatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Date and time at which the node was last updated in [RFC
     * 3339](https://www.ietf.org/rfc/rfc3339.txt) format with nano-seconds.
     */
    UpdatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Spec: NodeSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Description: NodeDescriptionSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Status: NodeStatusSchema.pipe(Schema.nullable).pipe(Schema.optional),
    ManagerStatus: ManagerStatusSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Node extends Schema.Schema.To<typeof NodeSchema> {}

export const SwarmSchema = Schema.extend(
    ClusterInfoSchema,
    Schema.struct({
        JoinTokens: JoinTokensSchema.pipe(Schema.nullable).pipe(Schema.optional),
    })
);

export interface Swarm extends Schema.Schema.To<typeof SwarmSchema> {}

/** Represents generic information about swarm. */
export const SwarmInfoSchema = Schema.struct({
    /** Unique identifier of for this node in the swarm. */
    NodeID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** IP address at which this node can be reached by other nodes in the swarm. */
    NodeAddr: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    LocalNodeState: Schema.enums(LocalNodeState).pipe(Schema.nullable).pipe(Schema.optional),
    ControlAvailable: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Error: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** List of ID's and addresses of other managers in the swarm. */
    RemoteManagers: arraySchema(PeerNodeSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Total number of nodes in the swarm. */
    Nodes: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Total number of managers in the swarm. */
    Managers: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Cluster: ClusterInfoSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SwarmInfo extends Schema.Schema.To<typeof SwarmInfoSchema> {}

/** User modifiable task configuration. */
export const TaskSpecSchema = Schema.struct({
    PluginSpec: TaskSpecPluginSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
    ContainerSpec: TaskSpecContainerSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
    NetworkAttachmentSpec: TaskSpecNetworkAttachmentSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Resources: TaskSpecResourcesSchema.pipe(Schema.nullable).pipe(Schema.optional),
    RestartPolicy: TaskSpecRestartPolicySchema.pipe(Schema.nullable).pipe(Schema.optional),
    Placement: TaskSpecPlacementSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * A counter that triggers an update even if no relevant parameters have
     * been changed.
     */
    ForceUpdate: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Runtime is the type of runtime specified for the task executor. */
    Runtime: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Specifies which networks the service should attach to. */
    Networks: arraySchema(NetworkAttachmentConfigSchema).pipe(Schema.nullable).pipe(Schema.optional),
    LogDriver: TaskSpecLogDriverSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface TaskSpec extends Schema.Schema.To<typeof TaskSpecSchema> {}

/** Volume configuration */
export const VolumeCreateOptionsSchema = Schema.struct({
    /** The new volume's name. If not specified, Docker generates a name. */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Name of the volume driver to use. */
    Driver: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * A mapping of driver options and values. These options are passed directly
     * to the driver and are driver specific.
     */
    DriverOpts: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** User-defined key/value metadata. */
    Labels: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    ClusterVolumeSpec: ClusterVolumeSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface VolumeCreateOptions extends Schema.Schema.To<typeof VolumeCreateOptionsSchema> {}

/** Volume configuration */
export const VolumesNameBodySchema = Schema.struct({
    Spec: ClusterVolumeSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface VolumesNameBody extends Schema.Schema.To<typeof VolumesNameBodySchema> {}

/** User modifiable configuration for a service. */
export const ServiceSpecSchema = Schema.struct({
    /** Name of the service. */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** User-defined key/value metadata. */
    Labels: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    TaskTemplate: TaskSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Mode: ServiceSpecModeSchema.pipe(Schema.nullable).pipe(Schema.optional),
    UpdateConfig: ServiceSpecUpdateConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    RollbackConfig: ServiceSpecRollbackConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Specifies which networks the service should attach to. */
    Networks: arraySchema(NetworkAttachmentConfigSchema).pipe(Schema.nullable).pipe(Schema.optional),
    EndpointSpec: EndpointSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface ServiceSpec extends Schema.Schema.To<typeof ServiceSpecSchema> {}

export enum SystemInfo_CgroupDriverEnum {
    Cgroupfs = "cgroupfs",
    Systemd = "systemd",
    None = "none",
}

export enum SystemInfo_CgroupVersionEnum {
    _1 = "1",
    _2 = "2",
}

export enum SystemInfo_IsolationEnum {
    Default = "default",
    Hyperv = "hyperv",
    Process = "process",
}

export const SystemInfoSchema = Schema.struct({
    /**
     * Unique identifier of the daemon. **Note**: The format of the ID itself is
     * not part of the API, and should not be considered stable.
     */
    ID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Total number of containers on the host. */
    Containers: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Number of containers with status `\"running\"`. */
    ContainersRunning: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Number of containers with status `\"paused\"`. */
    ContainersPaused: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Number of containers with status `\"stopped\"`. */
    ContainersStopped: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Total number of images on the host. Both _tagged_ and _untagged_
     * (dangling) images are counted.
     */
    Images: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Name of the storage driver in use. */
    Driver: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Information specific to the storage driver, provided as "label" / "value"
     * pairs. This information is provided by the storage driver, and formatted
     * in a way consistent with the output of `docker info` on the command line.
     * **Note**: The information returned in this field, including the
     * formatting of values and labels, should not be considered stable, and may
     * change without notice.
     */
    DriverStatus: arraySchema(arraySchema(stringSchema)).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Root directory of persistent Docker state. Defaults to `/var/lib/docker`
     * on Linux, and `C:\\ProgramData\\docker` on Windows.
     */
    DockerRootDir: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Plugins: PluginsInfoSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Indicates if the host has memory limit support enabled. */
    MemoryLimit: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Indicates if the host has memory swap limit support enabled. */
    SwapLimit: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Indicates if the host has kernel memory TCP limit support enabled. This
     * field is omitted if not supported. Kernel memory TCP limits are not
     * supported when using cgroups v2, which does not support the corresponding
     * `memory.kmem.tcp.limit_in_bytes` cgroup.
     */
    KernelMemoryTCP: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Indicates if CPU CFS(Completely Fair Scheduler) period is supported by
     * the host.
     */
    CpuCfsPeriod: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Indicates if CPU CFS(Completely Fair Scheduler) quota is supported by the
     * host.
     */
    CpuCfsQuota: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Indicates if CPU Shares limiting is supported by the host. */
    CPUShares: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Indicates if CPUsets (cpuset.cpus, cpuset.mems) are supported by the
     * host. See
     * [cpuset(7)](https://www.kernel.org/doc/Documentation/cgroup-v1/cpusets.txt)
     */
    CPUSet: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Indicates if the host kernel has PID limit support enabled. */
    PidsLimit: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Indicates if OOM killer disable is supported on the host. */
    OomKillDisable: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Indicates IPv4 forwarding is enabled. */
    IPv4Forwarding: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Indicates if `bridge-nf-call-iptables` is available on the host. */
    BridgeNfIptables: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Indicates if `bridge-nf-call-ip6tables` is available on the host. */
    BridgeNfIp6tables: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Indicates if the daemon is running in debug-mode / with debug-level
     * logging enabled.
     */
    Debug: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The total number of file Descriptors in use by the daemon process. This
     * information is only returned if debug-mode is enabled.
     */
    NFd: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The number of goroutines that currently exist. This information is only
     * returned if debug-mode is enabled.
     */
    NGoroutines: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Current system-time in [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt)
     * format with nano-seconds.
     */
    SystemTime: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The logging driver to use as a default for new containers. */
    LoggingDriver: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The driver to use for managing cgroups. */
    CgroupDriver: Schema.enums(SystemInfo_CgroupDriverEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /** The version of the cgroup. */
    CgroupVersion: Schema.enums(SystemInfo_CgroupVersionEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /** Number of event listeners subscribed. */
    NEventsListener: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Kernel version of the host. On Linux, this information obtained from
     * `uname`. On Windows this information is queried from the
     * HKEY_LOCAL_MACHINE/SOFTWARE/Microsoft/Windows NT/CurrentVersion registry
     * value, for example _"10.0 14393
     * (14393.1198.amd64fre.rs1_release_sec.170427-1353)"_.
     */
    KernelVersion: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Name of the host's operating system, for example: "Ubuntu 16.04.2 LTS" or
     * "Windows Server 2016 Datacenter"
     */
    OperatingSystem: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Version of the host's operating system **Note**: The information returned
     * in this field, including its very existence, and the formatting of
     * values, should not be considered stable, and may change without notice.
     */
    OSVersion: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Generic type of the operating system of the host, as returned by the Go
     * runtime (`GOOS`). Currently returned values are "linux" and "windows". A
     * full list of possible values can be found in the [Go
     * documentation](https://golang.org/doc/install/source#environment).
     */
    OSType: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Hardware architecture of the host, as returned by the Go runtime
     * (`GOARCH`). A full list of possible values can be found in the [Go
     * documentation](https://golang.org/doc/install/source#environment).
     */
    Architecture: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * The number of logical CPUs usable by the daemon. The number of available
     * CPUs is checked by querying the operating system when the daemon starts.
     * Changes to operating system CPU allocation after the daemon is started
     * are not reflected.
     */
    NCPU: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Total amount of physical memory available on the host, in bytes. */
    MemTotal: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Address / URL of the index server that is used for image search, and as a
     * default for user authentication for Docker Hub and Docker Cloud.
     */
    IndexServerAddress: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    RegistryConfig: RegistryServiceConfigSchema.pipe(Schema.nullable).pipe(Schema.optional),
    GenericResources: GenericResourcesSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * HTTP-proxy configured for the daemon. This value is obtained from the
     * [`HTTP_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html)
     * environment variable. Credentials ([user info
     * component](https://tools.ietf.org/html/rfc3986#section-3.2.1)) in the
     * proxy URL are masked in the API response. Containers do not automatically
     * inherit this configuration.
     */
    HttpProxy: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * HTTPS-proxy configured for the daemon. This value is obtained from the
     * [`HTTPS_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html)
     * environment variable. Credentials ([user info
     * component](https://tools.ietf.org/html/rfc3986#section-3.2.1)) in the
     * proxy URL are masked in the API response. Containers do not automatically
     * inherit this configuration.
     */
    HttpsProxy: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Comma-separated list of domain extensions for which no proxy should be
     * used. This value is obtained from the
     * [`NO_PROXY`](https://www.gnu.org/software/wget/manual/html_node/Proxies.html)
     * environment variable. Containers do not automatically inherit this
     * configuration.
     */
    NoProxy: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Hostname of the host. */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * User-defined labels (key/value metadata) as set on the daemon. **Note**:
     * When part of a Swarm, nodes can both have _daemon_ labels, set through
     * the daemon configuration, and _node_ labels, set from a manager node in
     * the Swarm. Node labels are not included in thisField. Node labels can be
     * retrieved using the `/nodes/(id)` endpoint onA manager node in the
     * Swarm.
     */
    Labels: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Indicates if experimental features are enabled on the daemon. */
    ExperimentalBuild: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Version string of the daemon. */
    ServerVersion: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * List of [OCI compliant](https://github.com/opencontainers/runtime-spec)
     * runtimes configured on the daemon. Keys hold the "name" used to reference
     * the runtime. The Docker daemon relies on an OCI compliant runtime
     * (invoked via the `containerd` daemon) as its interface to the Linux
     * kernel namespaces, cgroups, and SELinux. The default runtime is `runc`,
     * and automatically configured. Additional runtimes can be configured by
     * the user and will be listed here.
     */
    Runtimes: recordSchema(stringSchema, RuntimeSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Name of the default OCI runtime that is used when starting containers.
     * The default can be overridden per-container at create time.
     */
    DefaultRuntime: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Swarm: SwarmInfoSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Indicates if live restore is enabled. If enabled, containers are kept
     * running when the daemon is shutdown or upon daemon start if running
     * containers are detected.
     */
    LiveRestoreEnabled: booleanSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Represents the isolation technology to use as a default for containers.
     * The supported values are platform-specific. If no isolation value is
     * specified on daemon start, on Windows client, the default is `hyperv`,
     * and on Windows server, the default is `process`. This option is currently
     * not used on other platforms.
     */
    Isolation: Schema.enums(SystemInfo_IsolationEnum).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Name and, optional, path of the `docker-init` binary. If the path is
     * omitted, the daemon searches the host's `$PATH` for the binary and uses
     * the first result.
     */
    InitBinary: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    ContainerdCommit: CommitSchema.pipe(Schema.nullable).pipe(Schema.optional),
    RuncCommit: CommitSchema.pipe(Schema.nullable).pipe(Schema.optional),
    InitCommit: CommitSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * List of security features that are enabled on the daemon, such as
     * apparmor, seccomp, SELinux, user-namespaces (userns), rootless and
     * no-new-privileges. Additional configuration options for each security
     * feature may be present, and are included as a comma-separated list of
     * key/value pairs.
     */
    SecurityOptions: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Reports a summary of the product license on the daemon. If a commercial
     * license has been applied to the daemon, information such as number of
     * nodes, and expiration are included.
     */
    ProductLicense: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * List of custom default address pools for local networks, which can be
     * specified in the daemon.json file or dockerd option. Example: a Base
     * "10.10.0.0/16" with Size 24 will define the set of 256 10.10.[0-255].0/24
     * address pools.
     */
    DefaultAddressPools: arraySchema(SystemInfoDefaultAddressPoolsSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * List of warnings / informational messages about missing features, or
     * issues related to the daemon configuration. These messages can be printed
     * by the client as information to the user.
     */
    Warnings: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SystemInfo extends Schema.Schema.To<typeof SystemInfoSchema> {}

export const TaskSchema = Schema.struct({
    /** The ID of the task. */
    ID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Version: ObjectVersionSchema.pipe(Schema.nullable).pipe(Schema.optional),
    CreatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    UpdatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** Name of the task. */
    Name: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** User-defined key/value metadata. */
    Labels: recordSchema(stringSchema, stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
    Spec: TaskSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The ID of the service this task is part of. */
    ServiceID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Slot: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The ID of the node that this task is on. */
    NodeID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    AssignedGenericResources: GenericResourcesSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Status: TaskStatusSchema.pipe(Schema.nullable).pipe(Schema.optional),
    DesiredState: Schema.enums(TaskState).pipe(Schema.nullable).pipe(Schema.optional),
    JobIteration: ObjectVersionSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Task extends Schema.Schema.To<typeof TaskSchema> {}

export enum Volume_ScopeEnum {
    Local = "local",
    Global = "global",
}

export const VolumeSchema = Schema.struct({
    /** Name of the volume. */
    Name: stringSchema,
    /** Name of the volume driver used by the volume. */
    Driver: stringSchema,
    /** Mount path of the volume on the host. */
    Mountpoint: stringSchema,
    /** Date/Time the volume was created. */
    CreatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /**
     * Low-level details about the volume, provided by the volume driver.
     * Details are returned as a map with key/value pairs:
     * `{\"key\":\"value\",\"key2\":\"value2\"}`. The `Status` field is
     * optional, and is omitted if the volume driver does not support this
     * feature.
     */
    Status: recordSchema(stringSchema, anySchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** User-defined key/value metadata. */
    Labels: recordSchema(stringSchema, stringSchema),
    /**
     * The level at which the volume exists. Either `global` for cluster-wide,
     * or `local` for machine level.
     */
    Scope: Schema.enums(Volume_ScopeEnum),
    ClusterVolume: ClusterVolumeSchema.pipe(Schema.nullable).pipe(Schema.optional),
    /** The driver specific options used when creating the volume. */
    Options: recordSchema(stringSchema, stringSchema),
    UsageData: VolumeUsageDataSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Volume extends Schema.Schema.To<typeof VolumeSchema> {}

export const IdUpdateBody1Schema = ServiceSpecSchema;

export interface IdUpdateBody1 extends Schema.Schema.To<typeof IdUpdateBody1Schema> {}

export const ServiceSchema = Schema.struct({
    ID: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Version: ObjectVersionSchema.pipe(Schema.nullable).pipe(Schema.optional),
    CreatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    UpdatedAt: stringSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Spec: ServiceSpecSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Endpoint: ServiceEndpointSchema.pipe(Schema.nullable).pipe(Schema.optional),
    UpdateStatus: ServiceUpdateStatusSchema.pipe(Schema.nullable).pipe(Schema.optional),
    ServiceStatus: ServiceServiceStatusSchema.pipe(Schema.nullable).pipe(Schema.optional),
    JobStatus: ServiceJobStatusSchema.pipe(Schema.nullable).pipe(Schema.optional),
});

export interface Service extends Schema.Schema.To<typeof ServiceSchema> {}

export const ServicesCreateBodySchema = ServiceSpecSchema;

export interface ServicesCreateBody extends Schema.Schema.To<typeof ServicesCreateBodySchema> {}

export const SystemDataUsageResponseSchema = Schema.struct({
    LayersSize: numberSchema.pipe(Schema.nullable).pipe(Schema.optional),
    Images: arraySchema(ImageSummarySchema).pipe(Schema.nullable).pipe(Schema.optional),
    Containers: arraySchema(ContainerSummarySchema).pipe(Schema.nullable).pipe(Schema.optional),
    Volumes: arraySchema(VolumeSchema).pipe(Schema.nullable).pipe(Schema.optional),
    BuildCache: arraySchema(BuildCacheSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface SystemDataUsageResponse extends Schema.Schema.To<typeof SystemDataUsageResponseSchema> {}

/** Volume list response */
export const VolumeListResponseSchema = Schema.struct({
    /** List of volumes */
    Volumes: arraySchema(VolumeSchema).pipe(Schema.nullable).pipe(Schema.optional),
    /** Warnings that occurred when fetching the list of volumes. */
    Warnings: arraySchema(stringSchema).pipe(Schema.nullable).pipe(Schema.optional),
});

export interface VolumeListResponse extends Schema.Schema.To<typeof VolumeListResponseSchema> {}
