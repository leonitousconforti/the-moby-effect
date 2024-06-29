import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { HealthConfig } from "./HealthConfig.js";

/**
 * Configuration for a container that is portable between hosts.
 *
 * When used as `ContainerConfig` field in an image, `ContainerConfig` is an
 * optional field containing the configuration of the container that was last
 * committed when creating the image.
 *
 * Previous versions of Docker builder used this field to store build cache, and
 * it is not in active use anymore.
 */
export const ContainerConfig = S.Struct({
    /** The hostname to use for the container, as a valid RFC 1123 hostname. */
    Hostname: S.optional(S.String),
    /** The domain name to use for the container. */
    Domainname: S.optional(S.String),
    /** The user that commands are run as inside the container. */
    User: S.optional(S.String),
    /** Whether to attach to `stdin`. */
    AttachStdin: S.optional(S.Boolean, {
        default: () => false,
    }),
    /** Whether to attach to `stdout`. */
    AttachStdout: S.optional(S.Boolean, {
        default: () => true,
    }),
    /** Whether to attach to `stderr`. */
    AttachStderr: S.optional(S.Boolean, {
        default: () => true,
    }),
    /**
     * An object mapping ports to an empty object in the form:
     *
     * `{"<port>/<tcp|udp|sctp>": {}}`
     */
    ExposedPorts: S.optional(S.Record(S.String, S.Struct({}))),
    /** Attach standard streams to a TTY, including `stdin` if it is not closed. */
    Tty: S.optional(S.Boolean, {
        default: () => false,
    }),
    /** Open `stdin` */
    OpenStdin: S.optional(S.Boolean, {
        default: () => false,
    }),
    /** Close `stdin` after one attached client disconnects */
    StdinOnce: S.optional(S.Boolean, {
        default: () => false,
    }),
    /**
     * A list of environment variables to set inside the container in the form
     * `["VAR=value", ...]`. A variable without `=` is removed from the
     * environment, rather than to have an empty value.
     */
    Env: S.optional(S.Array(S.String)),
    /** Command to run specified as a string or an array of strings. */
    Cmd: S.optional(S.Array(S.String)),
    Healthcheck: S.optional(HealthConfig),
    /** Command is already escaped (Windows only) */
    ArgsEscaped: S.optional(S.Boolean, {
        default: () => false,
    }),
    /**
     * The name (or reference) of the image to use when creating the container,
     * or which was used when the container was created.
     */
    Image: S.optional(S.String),
    /**
     * An object mapping mount point paths inside the container to empty
     * objects.
     */
    Volumes: S.optional(S.Record(S.String, S.Struct({}))),
    /** The working directory for commands to run in. */
    WorkingDir: S.optional(S.String),
    /**
     * The entry point for the container as a string or an array of strings.
     *
     * If the array consists of exactly one empty string (`[""]`) then the entry
     * point is reset to system default (i.e., the entry point used by docker
     * when there is no `ENTRYPOINT` instruction in the `Dockerfile`).
     */
    Entrypoint: S.optional(S.Array(S.String)),
    /** Disable networking for the container. */
    NetworkDisabled: S.optional(S.Boolean),
    /**
     * MAC address of the container.
     *
     * Deprecated: this field is deprecated in API v1.44 and up. Use
     * EndpointSettings.MacAddress instead.
     */
    MacAddress: S.optional(S.String),
    /** `ONBUILD` metadata that were defined in the image's `Dockerfile`. */
    OnBuild: S.optional(S.Array(S.String)),
    /** User-defined key/value metadata. */
    Labels: S.optional(S.Record(S.String, S.String)),
    /** Signal to stop a container as a string or unsigned integer. */
    StopSignal: S.optional(S.String),
    /** Timeout to stop a container in seconds. */
    StopTimeout: S.optional(pipe(S.Number, S.int())),
    /** Shell for when `RUN`, `CMD`, and `ENTRYPOINT` uses a shell. */
    Shell: S.optional(S.Array(S.String)),
});

export type ContainerConfig = S.Schema.Type<typeof ContainerConfig>;
export const ContainerConfigEncoded = S.encodedSchema(ContainerConfig);
export type ContainerConfigEncoded = S.Schema.Encoded<typeof ContainerConfig>;
