import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { HealthConfig } from "./HealthConfig.js";
import { Limit } from "./Limit.js";
import { Mount } from "./Mount.js";
import { NetworkAttachmentConfig } from "./NetworkAttachmentConfig.js";
import { Platform } from "./Platform.js";
import { PluginPrivilege } from "./PluginPrivilege.js";
import { ResourceObject } from "./ResourceObject.js";

/** User modifiable task configuration. */
export const TaskSpec = S.Struct({
    /**
     * Plugin spec for the service. _(Experimental release only.)_ <p><br
     * /></p>> **Note**: ContainerSpec, NetworkAttachmentSpec, and PluginSpec
     * are mutually exclusive.> PluginSpec is only used when the Runtime field
     * is set to `plugin`.> NetworkAttachmentSpec is used when the Runtime field
     * is set to> `attachment`.
     */
    PluginSpec: S.optional(
        S.Struct({
            /** The name or 'alias' to use for the plugin. */
            Name: S.optional(S.String),
            /** The plugin image reference to use. */
            Remote: S.optional(S.String),
            /** Disable the plugin once scheduled. */
            Disabled: S.optional(S.Boolean),
            PluginPrivilege: S.optional(S.Array(PluginPrivilege)),
        })
    ),
    /**
     * Container spec for the service. <p><br /></p>> **Note**: ContainerSpec,
     * NetworkAttachmentSpec, and PluginSpec are mutually exclusive.> PluginSpec
     * is only used when the Runtime field is set to `plugin`.>
     * NetworkAttachmentSpec is used when the Runtime field is set to>
     * `attachment`.
     */
    ContainerSpec: S.optional(
        S.Struct({
            /** The image name to use for the container */
            Image: S.optional(S.String),
            /** User-defined key/value data. */
            Labels: S.optional(S.Record(S.String, S.String)),
            /** The command to be run in the image. */
            Command: S.optional(S.Array(S.String)),
            /** Arguments to the command. */
            Args: S.optional(S.Array(S.String)),
            /**
             * The hostname to use for the container, as a valid [RFC
             * 1123](https://tools.ietf.org/html/rfc1123) hostname.
             */
            Hostname: S.optional(S.String),
            /** A list of environment variables in the form `VAR=value`. */
            Env: S.optional(S.Array(S.String)),
            /** The working directory for commands to run in. */
            Dir: S.optional(S.String),
            /** The user inside the container. */
            User: S.optional(S.String),
            /**
             * A list of additional groups that the container process will run
             * as.
             */
            Groups: S.optional(S.Array(S.String)),
            /** Security options for the container */
            Privileges: S.optional(
                S.Struct({
                    /** CredentialSpec for managed service account (Windows only) */
                    CredentialSpec: S.optional(
                        S.Struct({
                            /**
                             * Load credential spec from a Swarm Config with the
                             * given ID. The specified config must also be
                             * present in the Configs field with the Runtime
                             * property set.
                             *
                             *         <p><br /></p>
                             *
                             *
                             *     > **Note**: `CredentialSpec.File`, `CredentialSpec.Registry`,
                             *     > and `CredentialSpec.Config` are mutually exclusive.
                             */
                            Config: S.optional(S.String),
                            /**
                             * Load credential spec from this file. The file is
                             * read by the daemon, and must be present in the
                             * `CredentialSpecs` subdirectory in the docker data
                             * directory, which defaults to
                             * `C:\ProgramData\Docker\` on Windows.
                             *
                             *         For example, specifying `spec.json` loads
                             *     `C:\ProgramData\Docker\CredentialSpecs\spec.json`.
                             *
                             *     <p><br /></p>
                             *
                             *     > **Note**: `CredentialSpec.File`, `CredentialSpec.Registry`,
                             *     > and `CredentialSpec.Config` are mutually exclusive.
                             */
                            File: S.optional(S.String),
                            /**
                             * Load credential spec from this value in the
                             * Windows registry. The specified registry value
                             * must be located in:
                             *
                             *         `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Virtualization\Containers\CredentialSpecs`
                             *
                             *     <p><br /></p>
                             *
                             *
                             *     > **Note**: `CredentialSpec.File`, `CredentialSpec.Registry`,
                             *     > and `CredentialSpec.Config` are mutually exclusive.
                             */
                            Registry: S.optional(S.String),
                        })
                    ),
                    /** SELinux labels of the container */
                    SELinuxContext: S.optional(
                        S.Struct({
                            /** Disable SELinux */
                            Disable: S.optional(S.Boolean),
                            /** SELinux user label */
                            User: S.optional(S.String),
                            /** SELinux role label */
                            Role: S.optional(S.String),
                            /** SELinux type label */
                            Type: S.optional(S.String),
                            /** SELinux level label */
                            Level: S.optional(S.String),
                        })
                    ),
                    /** Options for configuring seccomp on the container */
                    Seccomp: S.optional(
                        S.Struct({
                            Mode: S.optional(S.Literal("default", "unconfined", "custom")),
                            /** The custom seccomp profile as a json object */
                            Profile: S.optional(S.String),
                        })
                    ),
                    /** Options for configuring AppArmor on the container */
                    AppArmor: S.optional(
                        S.Struct({
                            Mode: S.optional(S.Literal("default", "disabled")),
                        })
                    ),
                    /** Configuration of the no_new_privs bit in the container */
                    NoNewPrivileges: S.optional(S.Boolean),
                })
            ),
            /** Whether a pseudo-TTY should be allocated. */
            TTY: S.optional(S.Boolean),
            /** Open `stdin` */
            OpenStdin: S.optional(S.Boolean),
            /** Mount the container's root filesystem as read only. */
            ReadOnly: S.optional(S.Boolean),
            /**
             * Specification for mounts to be added to containers created as
             * part of the service.
             */
            Mounts: S.optional(S.Array(Mount)),
            /** Signal to stop the container. */
            StopSignal: S.optional(S.String),
            /**
             * Amount of time to wait for the container to terminate before
             * forcefully killing it.
             */
            StopGracePeriod: S.optional(pipe(S.Number, S.int())),
            HealthCheck: S.optional(HealthConfig),
            /**
             * A list of hostname/IP mappings to add to the container's `hosts`
             * file. The format of extra hosts is specified in the
             * [hosts(5)](http://man7.org/linux/man-pages/man5/hosts.5.html) man
             * page:
             *
             *         IP_address canonical_hostname [aliases...]
             */
            Hosts: S.optional(S.Array(S.String)),
            /**
             * Specification for DNS related configurations in resolver
             * configuration file (`resolv.conf`).
             */
            DNSConfig: S.optional(
                S.Struct({
                    /** The IP addresses of the name servers. */
                    Nameservers: S.optional(S.Array(S.String)),
                    /** A search list for host-name lookup. */
                    Search: S.optional(S.Array(S.String)),
                    /**
                     * A list of internal resolver variables to be modified
                     * (e.g., `debug`, `ndots:3`, etc.).
                     */
                    Options: S.optional(S.Array(S.String)),
                })
            ),
            /**
             * Secrets contains references to zero or more secrets that will be
             * exposed to the service.
             */
            Secrets: S.optional(
                S.Array(
                    S.Struct({
                        /**
                         * File represents a specific target that is backed by a
                         * file.
                         */
                        File: S.optional(
                            S.Struct({
                                /**
                                 * Name represents the final filename in the
                                 * filesystem.
                                 */
                                Name: S.optional(S.String),
                                /** UID represents the file UID. */
                                UID: S.optional(S.String),
                                /** GID represents the file GID. */
                                GID: S.optional(S.String),
                                /** Mode represents the FileMode of the file. */
                                Mode: S.optional(pipe(S.Number, S.int())),
                            })
                        ),
                        /**
                         * SecretID represents the ID of the specific secret
                         * that we're referencing.
                         */
                        SecretID: S.optional(S.String),
                        /**
                         * SecretName is the name of the secret that this
                         * references, but this is just provided for
                         * lookup/display purposes. The secret in the reference
                         * will be identified by its ID.
                         */
                        SecretName: S.optional(S.String),
                    })
                )
            ),
            /**
             * Configs contains references to zero or more configs that will be
             * exposed to the service.
             */
            Configs: S.optional(
                S.Array(
                    S.Struct({
                        /**
                         * File represents a specific target that is backed by a
                         * file.
                         *
                         *       <p><br /><p>
                         *
                         *       > **Note**: `Configs.File` and `Configs.Runtime` are mutually exclusive
                         */
                        File: S.optional(
                            S.Struct({
                                /**
                                 * Name represents the final filename in the
                                 * filesystem.
                                 */
                                Name: S.optional(S.String),
                                /** UID represents the file UID. */
                                UID: S.optional(S.String),
                                /** GID represents the file GID. */
                                GID: S.optional(S.String),
                                /** Mode represents the FileMode of the file. */
                                Mode: S.optional(pipe(S.Number, S.int())),
                            })
                        ),
                        /**
                         * Runtime represents a target that is not mounted into
                         * the container but is used by the task
                         *
                         *       <p><br /><p>
                         *
                         *       > **Note**: `Configs.File` and `Configs.Runtime` are mutually
                         *       > exclusive
                         */
                        Runtime: S.optional(S.Struct({})),
                        /**
                         * ConfigID represents the ID of the specific config
                         * that we're referencing.
                         */
                        ConfigID: S.optional(S.String),
                        /**
                         * ConfigName is the name of the config that this
                         * references, but this is just provided for
                         * lookup/display purposes. The config in the reference
                         * will be identified by its ID.
                         */
                        ConfigName: S.optional(S.String),
                    })
                )
            ),
            /**
             * Isolation technology of the containers running the service.
             * (Windows only)
             */
            Isolation: S.optional(S.Literal("default", "process", "hyperv")),
            /**
             * Run an init inside the container that forwards signals and reaps
             * processes. This field is omitted if empty, and the default (as
             * configured on the daemon) is used.
             */
            Init: S.optional(S.Boolean),
            /**
             * Set kernel namedspaced parameters (sysctls) in the container. The
             * Sysctls option on services accepts the same sysctls as the are
             * supported on containers. Note that while the same sysctls are
             * supported, no guarantees or checks are made about their
             * suitability for a clustered environment, and it's up to the user
             * to determine whether a given sysctl will work properly in a
             * Service.
             */
            Sysctls: S.optional(S.Record(S.String, S.String)),
            /**
             * A list of kernel capabilities to add to the default set for the
             * container.
             */
            CapabilityAdd: S.optional(S.Array(S.String)),
            /**
             * A list of kernel capabilities to drop from the default set for
             * the container.
             */
            CapabilityDrop: S.optional(S.Array(S.String)),
            /**
             * A list of resource limits to set in the container. For example:
             * `{"Name": "nofile", "Soft": 1024, "Hard": 2048}`"
             */
            Ulimits: S.optional(
                S.Array(
                    S.Struct({
                        /** Name of ulimit */
                        Name: S.optional(S.String),
                        /** Soft limit */
                        Soft: S.optional(pipe(S.Number, S.int())),
                        /** Hard limit */
                        Hard: S.optional(pipe(S.Number, S.int())),
                    })
                )
            ),
        })
    ),
    /**
     * Read-only spec type for non-swarm containers attached to swarm overlay
     * networks. <p><br /></p>> **Note**: ContainerSpec, NetworkAttachmentSpec,
     * and PluginSpec are mutually exclusive.> PluginSpec is only used when the
     * Runtime field is set to `plugin`.> NetworkAttachmentSpec is used when the
     * Runtime field is set to> `attachment`.
     */
    NetworkAttachmentSpec: S.optional(
        S.Struct({
            /** ID of the container represented by this task */
            ContainerID: S.optional(S.String),
        })
    ),
    /**
     * Resource requirements which apply to each individual container created as
     * part of the service.
     */
    Resources: S.optional(
        S.Struct({
            Limits: S.optional(Limit),
            Reservations: S.optional(ResourceObject),
        })
    ),
    /**
     * Specification for the restart policy which applies to containers created
     * as part of this service.
     */
    RestartPolicy: S.optional(
        S.Struct({
            /** Condition for restart. */
            Condition: S.optional(S.Literal("none", "on-failure", "any")),
            /** Delay between restart attempts. */
            Delay: S.optional(pipe(S.Number, S.int())),
            /**
             * Maximum attempts to restart a given container before giving up
             * (default value is 0, which is ignored).
             */
            MaxAttempts: S.optional(pipe(S.Number, S.int()), {
                default: () => 0,
            }),
            /**
             * Windows is the time window used to evaluate the restart policy
             * (default value is 0, which is unbounded).
             */
            Window: S.optional(pipe(S.Number, S.int()), {
                default: () => 0,
            }),
        })
    ),
    Placement: S.optional(
        S.Struct({
            /**
             * An array of constraint expressions to limit the set of nodes
             * where a task can be scheduled. Constraint expressions can either
             * use a _match_ (`==`) or _exclude_ (`!=`) rule. Multiple
             * constraints find nodes that satisfy every expression (AND match).
             * Constraints can match node or Docker Engine labels as follows:
             *
             *     node attribute       | matches                        | example
             *     ---------------------|--------------------------------|-----------------------------------------------
             *     `node.id`            | Node ID                        | `node.id==2ivku8v2gvtg4`
             *     `node.hostname`      | Node hostname                  | `node.hostname!=node-2`
             *     `node.role`          | Node role (`manager`/`worker`) | `node.role==manager`
             *     `node.platform.os`   | Node operating system          | `node.platform.os==windows`
             *     `node.platform.arch` | Node architecture              | `node.platform.arch==x86_64`
             *     `node.labels`        | User-defined node labels       | `node.labels.security==high`
             *     `engine.labels`      | Docker Engine's labels         | `engine.labels.operatingsystem==ubuntu-14.04`
             *
             *     `engine.labels` apply to Docker Engine labels like operating system,
             *     drivers, etc. Swarm administrators add `node.labels` for operational
             *     purposes by using the [`node update endpoint`](#operation/NodeUpdate).
             */
            Constraints: S.optional(S.Array(S.String)),
            /**
             * Preferences provide a way to make the scheduler aware of factors
             * such as topology. They are provided in order from highest to
             * lowest precedence.
             */
            Preferences: S.optional(
                S.Array(
                    S.Struct({
                        Spread: S.optional(
                            S.Struct({
                                /** Label descriptor, such as `engine.labels.az`. */
                                SpreadDescriptor: S.optional(S.String),
                            })
                        ),
                    })
                )
            ),
            /**
             * Maximum number of replicas for per node (default value is 0,
             * which is unlimited)
             */
            MaxReplicas: S.optional(pipe(S.Number, S.int()), {
                default: () => 0,
            }),
            /**
             * Platforms stores all the platforms that the service's image can
             * run on. This field is used in the platform filter for scheduling.
             * If empty, then the platform filter is off, meaning there are no
             * scheduling restrictions.
             */
            Platforms: S.optional(S.Array(Platform)),
        })
    ),
    /**
     * A counter that triggers an update even if no relevant parameters have
     * been changed.
     */
    ForceUpdate: S.optional(pipe(S.Number, S.int())),
    /** Runtime is the type of runtime specified for the task executor. */
    Runtime: S.optional(S.String),
    /** Specifies which networks the service should attach to. */
    Networks: S.optional(S.Array(NetworkAttachmentConfig)),
    /**
     * Specifies the log driver to use for tasks created from this spec. If not
     * present, the default one for the swarm will be used, finally falling back
     * to the engine default if not specified.
     */
    LogDriver: S.optional(
        S.Struct({
            Name: S.optional(S.String),
            Options: S.optional(S.Record(S.String, S.String)),
        })
    ),
});

export type TaskSpec = S.Schema.Type<typeof TaskSpec>;
export const TaskSpecEncoded = S.encodedSchema(TaskSpec);
export type TaskSpecEncoded = S.Schema.Encoded<typeof TaskSpec>;
