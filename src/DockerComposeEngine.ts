/**
 * Docker compose engine.
 *
 * @since 1.0.0
 */

import type * as Socket from "@effect/platform/Socket";
import type * as Array from "effect/Array";
import type * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type * as Layer from "effect/Layer";
import type * as Scope from "effect/Scope";
import type * as Stream from "effect/Stream";
import type * as DockerEngine from "./DockerEngine.ts";
import type * as MobyDemux from "./MobyDemux.ts";
import type * as MobyEndpoints from "./MobyEndpoints.ts";

import * as internal from "./internal/engines/dockerCompose.ts";

/**
 * @since 1.0.0
 * @category Errors
 */
export const DockerComposeErrorTypeId: unique symbol = internal.DockerComposeErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export type DockerComposeErrorTypeId = typeof DockerComposeErrorTypeId;

/**
 * @since 1.0.0
 * @category Errors
 */
export const isDockerComposeError: (u: unknown) => u is DockerComposeError = internal.isDockerComposeError;

/**
 * @since 1.0.0
 * @category Errors
 */
export type DockerComposeError = internal.DockerComposeError;

/**
 * @since 1.0.0
 * @category Errors
 */
export const DockerComposeError: typeof internal.DockerComposeError = internal.DockerComposeError;

/**
 * @since 1.0.0
 * @category Params
 */
export interface ComposeOptions {
    /** Include all resources, even those not used by services */
    readonly allResources?: boolean | undefined;

    /** Control when to print ANSI control characters */
    readonly ansi?: "never" | "always" | "auto" | undefined;

    /** Run compose in backward compatibility mode */
    readonly compatibility?: boolean | undefined;

    /** Execute command in dry run mode */
    readonly dryRun?: boolean | undefined;

    /** Specify an alternate environment file */
    readonly envFile?: Array<string> | undefined;

    /** Compose configuration files */
    readonly file?: Array<string> | undefined;

    /** Control max parallelism, -1 for unlimited (default -1) */
    readonly parallel?: number | undefined;

    /** Specify a profile to enable */
    readonly profile?: Array<string> | undefined;

    /** Set type of progress output (auto, tty, plain, json, quiet). */
    readonly progress?: "auto" | "tty" | "plain" | "json" | "quiet" | undefined;

    /** Specify an alternate working directory */
    readonly projectDirectory?: string | undefined;

    /** Project name */
    readonly projectName?: string | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface BuildOptions {
    /** Set build-time variables for services. */
    readonly buildArgs?: Record<string, string> | undefined;

    /** Set builder to use. */
    readonly builder?: string | undefined;

    /** Set memory limit for the build container. Not supported by BuildKit. */
    readonly memoryLimit?: number | undefined;

    /** Do not use cache when building the image. */
    readonly noCache?: boolean | undefined;

    /** Always attempt to pull a newer version of the image. */
    readonly pull?: boolean | undefined;

    /** Push service images. */
    readonly push?: boolean | undefined;

    /** Don't print anything to STDOUT. */
    readonly quiet?: boolean | undefined;

    /**
     * Set SSH authentications used when building service images. (use 'default'
     * for using your default SSH Agent)
     */
    readonly ssh?: string | undefined;

    /** Also build dependencies (transitively). */
    readonly withDependencies?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ConfigOptions {
    /** Print environment used for interpolation. */
    readonly environment?: boolean | undefined;

    /** Format the output. */
    readonly format?: "yaml" | "json" | undefined;

    /** Print the service config hash, one per line. */
    readonly hash?: boolean | undefined;

    /** Print the image names, one per line. */
    readonly images?: boolean | undefined;

    /**
     * Don't check model consistency - warning: may produce invalid Compose
     * output
     */
    readonly noConsistency?: boolean | undefined;

    /** Don't interpolate environment variables */
    readonly noInterpolate?: boolean | undefined;

    /** Don't normalize compose model */
    readonly noNormalize?: boolean | undefined;

    /** Don't resolve file paths */
    readonly noPathResolution?: boolean | undefined;

    /** Save to file (default to stdout) */
    readonly output?: string | undefined;

    /** Only validate the configuration, don't print anything */
    readonly quiet?: boolean | undefined;

    /** Pin image tags to digests */
    readonly resolveImageDigests?: boolean | undefined;

    /** Print the service names, one per line. */
    readonly services?: boolean | undefined;

    /** Print model variables and default values. */
    readonly variables?: boolean | undefined;

    /** Print the volume names, one per line. */
    readonly volumes?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface CopyOptions {
    /** Include containers created by the run command */
    readonly all?: boolean | undefined;

    /** Archive mode (copy all uid/gid information) */
    readonly archive?: boolean | undefined;

    /** Always follow symbol link in SRC_PATH */
    readonly followLink?: boolean | undefined;

    /** Index of the container if service has multiple replicas */
    readonly index?: number | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface CreateOptions {
    /** Build images before starting containers */
    readonly build?: boolean | undefined;

    /** Recreate containers even if their configuration and image haven't changed */
    readonly forceRecreate?: boolean | undefined;

    /** Don't build an image, even if it's policy */
    readonly noBuild?: boolean | undefined;

    /**
     * If containers already exist, don't recreate them. Incompatible with
     * --force-recreate.
     */
    readonly noRecreate?: boolean | undefined;

    /** Pull image before running ("always"|"missing"|"never"|"build") */
    readonly pullPolicy?: "always" | "missing" | "never" | "build" | undefined;

    /** Pull without printing progress information */
    readonly quietPull?: boolean | undefined;

    /** Remove containers for services not defined in the Compose file */
    readonly removeOrphans?: boolean | undefined;

    /**
     * Scale SERVICE to NUM instances. Overrides the `scale` setting in the
     * Compose file if present.
     */
    readonly scale?: Record<string, number> | undefined;

    /** Assume "yes" as answer to all prompts and run non-interactively */
    readonly y?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface DownOptions {
    /** Remove containers for services not defined in the Compose file. */
    readonly removeOrphans?: boolean | undefined;

    /**
     * Remove images used by services. "local" remove only images that don't
     * have a custom tag ("local"|"all").
     */
    readonly rmi?: "all" | "local" | "none" | undefined;

    /** Specify a shutdown timeout in seconds. */
    readonly timeout?: number | undefined;

    /**
     * Remove named volumes declared in the "volumes" section of the Compose
     * file and anonymous volumes attached to containers.
     */
    readonly volumes?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface EventsOptions {
    /** Output events as a stream of json objects */
    readonly json?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ExecOptions {
    /** Detached mode: Run command in the background */
    readonly detach?: boolean | undefined;

    /** Set environment variables */
    readonly env?: Record<string, string> | Array<string> | undefined;

    /** Index of the container if service has multiple replicas */
    readonly index?: number | undefined;

    /**
     * Disable pseudo-TTY allocation. By default `docker compose exec` allocates
     * a TTY.
     *
     * @default true
     */
    readonly noTTY?: boolean | undefined;

    /** Give extended privileges to the process */
    readonly privileged?: boolean | undefined;

    /** Run the command as this user */
    readonly user?: string | undefined;

    /** Path to workdir directory for this command */
    readonly workdir?: string | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ImagesOptions {
    /** Format the output. */
    readonly format?: "table" | "json" | undefined;

    /** Only display Ids */
    readonly quiet?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface KillOptions {
    /** Remove containers for services not defined in the Compose file. */
    readonly removeOrphans?: boolean | undefined;

    /** SIGNAL to send to the container. */
    readonly signal?: string | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface LogsOptions {
    /** Follow log output */
    readonly follow?: boolean | undefined;

    /** Index of the container if service has multiple replicas */
    readonly index?: number | undefined;

    /** Produce monochrome output */
    readonly noColor?: boolean | undefined;

    /** Don't print prefix in logs */
    readonly noLogPrefix?: boolean | undefined;

    /**
     * Show logs since timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g.
     * 42m for 42 minutes)
     */
    readonly since?: string | undefined;

    /** Number of lines to show from the end of the logs for each container */
    readonly tail?: number | "all" | undefined;

    /** Show timestamps */
    readonly timestamps?: boolean | undefined;

    /**
     * Show logs before a timestamp (e.g. 2013-01-02T13:23:37Z) or relative
     * (e.g. 42m for 42 minutes)
     */
    readonly until?: string | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface ListOptions {
    /** Show all stopped Compose projects */
    readonly all?: boolean | undefined;

    /** Filter output based on conditions provided */
    readonly filter?: string | Record<string, string> | undefined;

    /** Format the output. */
    readonly format?: "table" | "json" | undefined;

    /** Only display project names */
    readonly quiet?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface PortOptions {
    /** Index of the container if service has multiple replicas. */
    readonly index?: number | undefined;

    /** Tcp or udp. */
    readonly protocol?: "tcp" | "udp" | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface PsOptions {
    /** Show all stopped containers (including those created by the run command) */
    readonly all?: boolean | undefined;

    /** Filter services by a property (supported filters: status) */
    readonly filter?: string | Record<string, string> | undefined;

    /**
     * Format output using a custom template: 'table': Print output in table
     * format with column headers (default) 'table TEMPLATE': Print output in
     * table format using the given Go template 'json': Print in JSON format
     * 'TEMPLATE': Print output using the given Go template
     */
    readonly format?: string | undefined;

    /** Don't truncate output */
    readonly noTrunc?: boolean | undefined;

    /** Include orphaned services (not declared by project) */
    readonly orphans?: boolean | undefined;

    /** Only display IDs */
    readonly quiet?: boolean | undefined;

    /** Display services */
    readonly services?: boolean | undefined;

    /** Filter services by status. */
    readonly status?: "paused" | "restarting" | "removing" | "running" | "dead" | "created" | "exited" | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface PullOptions {
    /** Ignore images that can be built. */
    readonly ignoreBuildable?: boolean | undefined;

    /** Pull what it can and ignores images with pull failures. */
    readonly ignorePullFailure?: boolean | undefined;

    /** Also pull services declared as dependencies. */
    readonly includeDeps?: boolean | undefined;

    /** Apply pull policy. */
    readonly policy?: "always" | "missing" | undefined;

    /** Pull without printing progress information. */
    readonly quiet?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface PushOptions {
    /** Push what it can and ignores images with push failures */
    readonly ignorePushFailures?: boolean | undefined;

    /** Also push images of services declared as dependencies */
    readonly includeDeps?: boolean | undefined;

    /** Push without printing progress information */
    readonly quiet?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface RestartOptions {
    /** Don't restart dependent services. */
    readonly noDeps?: boolean | undefined;

    /** Specify a shutdown timeout in seconds */
    readonly timeout?: number | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface RmOptions {
    /** Don't ask to confirm removal */
    readonly force?: boolean | undefined;

    /** Stop the containers, if required, before removing */
    readonly stop?: boolean | undefined;

    /** Remove any anonymous volumes attached to containers */
    readonly volumes?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface RunOptions {
    /** Build image before starting container */
    readonly build?: boolean | undefined;

    /** Add Linux capabilities */
    readonly capAdd?: Array<string> | undefined;

    /** Drop Linux capabilities */
    readonly capDrop?: Array<string> | undefined;

    /** Run container in background and print container ID */
    readonly detach?: boolean | undefined;

    /** Override the entrypoint of the image */
    readonly entrypoint?: string | undefined;

    /** Set environment variables */
    readonly env?: Array<string> | undefined;

    /** Keep STDIN open even if not attached */
    readonly interactive?: boolean | undefined;

    /** Add or override a label */
    readonly label?: Array<string> | undefined;

    /** Assign a name to the container */
    readonly name?: string | undefined;

    /** Disable pseudo-TTY allocation (default: auto-detected) */
    readonly noTTY?: boolean | undefined;

    /** Don't start linked services */
    readonly noDeps?: boolean | undefined;

    /** Publish a container's port(s) to the host */
    readonly publish?: Array<string> | undefined;

    /** Pull image before running ("always"|"missing"|"never") */
    readonly pullPolicy?: "always" | "missing" | "never" | undefined;

    /** Pull without printing progress information */
    readonly quietPull?: boolean | undefined;

    /** Remove containers for services not defined in the Compose file */
    readonly removeOrphans?: boolean | undefined;

    /** Automatically remove the container when it exits */
    readonly rm?: boolean | undefined;

    /** Run command with all service's ports enabled and mapped to the host */
    readonly servicePorts?: boolean | undefined;

    /**
     * Use the service's network useAliases in the network(s) the container
     * connects to
     */
    readonly useAliases?: boolean | undefined;

    /** Run as specified username or uid */
    readonly user?: string | undefined;

    /** Bind mount a volume */
    readonly volume?: Array<string> | undefined;

    /** Working directory inside the container */
    readonly workdir?: string | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface StopOptions {
    /** Specify a shutdown timeout in seconds */
    readonly timeout?: number | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface UpOptions {
    /**
     * Stops all containers if any container was stopped. Incompatible with
     * detach.
     */
    readonly abortOnContainerExit?: boolean | undefined;

    /**
     * Stops all containers if any container was stopped. Incompatible with
     * detach.
     */
    readonly abortOnContainerFailure?: boolean | undefined;

    /** Recreate dependent containers. Incompatible with no-recreate. */
    readonly alwaysRecreateDeps?: boolean | undefined;

    /**
     * Restrict attaching to the specified services. Incompatible with
     * attach-dependencies.
     */
    readonly attach?: boolean | undefined;

    /** Automatically attach to log output of dependent services. */
    readonly attachDependencies?: boolean | undefined;

    /** Build images before starting containers. */
    readonly build?: boolean | undefined;

    /** Detached mode: Run containers in the background. */
    readonly detach?: boolean | undefined;

    /**
     * Return the exit code of the selected service container. Implies
     * abort-on-container-exit.
     */
    readonly exitCodeFrom?: string | undefined;

    /**
     * Recreate containers even if their configuration and image haven't
     * changed.
     */
    readonly forceRecreate?: boolean | undefined;

    /**
     * Enable interactive shortcuts when running attached. Incompatible with
     * detach.
     */
    readonly menu?: boolean | undefined;

    /** Do not attach (stream logs) to the specified services. */
    readonly noAttach?: boolean | undefined;

    /** Don't build an image, even if it's policy. */
    readonly noBuild?: boolean | undefined;

    /** Produce monochrome output. */
    readonly noColor?: boolean | undefined;

    /** Don't start linked services. */
    readonly noDeps?: boolean | undefined;

    /** Don't print prefix in logs. */
    readonly noLogPrefix?: boolean | undefined;

    /**
     * If containers already exist, don't recreate them. Incompatible with
     * force-recreate.
     */
    readonly noRecreate?: boolean | undefined;

    /** Don't start the services after creating them. */
    readonly noStart?: boolean | undefined;

    /** Pull image before running */
    readonly pull?: "always" | "missing" | "never" | undefined;

    /** Pull without printing progress information. */
    readonly quietPull?: boolean | undefined;

    /** Remove containers for services not defined in the Compose file. */
    readonly removeOrphans?: boolean | undefined;

    /**
     * Recreate anonymous volumes instead of retrieving data from the previous
     * containers.
     */
    readonly renewAnonVolumes?: boolean | undefined;

    /**
     * Scale SERVICE to NUM instances. Overrides the scale setting in the
     * Compose file if present.
     */
    readonly scale?: string | undefined;

    /**
     * Use this timeout in seconds for container shutdown when attached or when
     * containers are already running.
     */
    readonly timeout?: number | undefined;

    /** Show timestamps. */
    readonly timestamps?: boolean | undefined;

    /** Wait for services to be running|healthy. Implies detached mode. */
    readonly wait?: boolean | string;

    /**
     * Maximum duration in seconds to wait for the project to be running or
     * healthy.
     */
    readonly waitTimeout?: number | undefined;

    /** Assume "yes" as answer to all prompts and run non-interactively. */
    readonly yes?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface VersionOptions {
    /** Format the output. */
    readonly format?: "json" | "pretty";

    /** Shows only Compose's version number */
    readonly short?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Params
 */
export interface WaitOptions {
    /** Drops project when the first container stops */
    readonly downProject?: boolean | undefined;
}

/**
 * @since 1.0.0
 * @category Type id
 */
export const TypeId: unique symbol = internal.TypeId;

/**
 * @since 1.0.0
 * @category Type id
 */
export type TypeId = typeof TypeId;

/**
 * @since 1.0.0
 * @category Models
 */
export interface DockerCompose {
    readonly [TypeId]: TypeId;

    readonly build: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined,
        options?: BuildOptions | undefined
    ) => Stream.Stream<string, E1 | DockerComposeError, never>;

    readonly config: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined,
        options?: ConfigOptions | undefined
    ) => Effect.Effect<string, E1 | DockerComposeError, never>;

    readonly cpTo: <E1, E2>(
        project: Stream.Stream<Uint8Array, E1, never>,
        service: string,
        localSrc: Stream.Stream<Uint8Array, E2, never>,
        remoteDestLocation: string,
        options?: CopyOptions | undefined
    ) => Effect.Effect<void, E1 | E2 | DockerComposeError, never>;

    readonly cpFrom: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        service: string,
        remoteSrcLocation: string,
        options?: CopyOptions | undefined
    ) => Stream.Stream<Uint8Array, E1 | DockerComposeError, never>;

    readonly create: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined,
        options?: CreateOptions | undefined
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly down: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined,
        options?: DownOptions | undefined
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly events: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined,
        options?: EventsOptions | undefined
    ) => Stream.Stream<string, E1 | DockerComposeError, never>;

    readonly exec: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        service: string,
        command: string,
        args?: Array<string> | undefined,
        options?: ExecOptions | undefined
    ) => Effect.Effect<
        MobyDemux.MultiplexedChannel<never, DockerEngine.DockerError | Socket.SocketError, never>,
        E1 | DockerComposeError,
        Scope.Scope
    >;

    readonly images: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined,
        options?: ImagesOptions | undefined
    ) => Stream.Stream<string, E1 | DockerComposeError, never>;

    readonly kill: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined,
        options?: KillOptions | undefined
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly logs: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined,
        options?: LogsOptions | undefined
    ) => Stream.Stream<string, E1 | DockerComposeError, never>;

    readonly ls: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        options?: ListOptions | undefined
    ) => Stream.Stream<string, E1 | DockerComposeError, never>;

    readonly pause: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly port: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        service: string,
        privatePort: number,
        options?: PortOptions | undefined
    ) => Effect.Effect<number, E1 | DockerComposeError, never>;

    readonly ps: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined,
        options?: PsOptions | undefined
    ) => Stream.Stream<string, E1 | DockerComposeError, never>;

    readonly pull: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined,
        options?: PullOptions | undefined
    ) => Stream.Stream<string, E1 | DockerComposeError, never>;

    readonly push: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined,
        options?: PushOptions | undefined
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly restart: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined,
        options?: RestartOptions | undefined
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly rm: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined,
        options?: RmOptions | undefined
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly run: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        service: string,
        command: string,
        args?: Array<string> | undefined,
        options?: RunOptions | undefined
    ) => Effect.Effect<
        MobyDemux.MultiplexedChannel<never, DockerEngine.DockerError | Socket.SocketError, never>,
        E1 | DockerComposeError,
        Scope.Scope
    >;

    readonly start: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly stop: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined,
        options?: StopOptions | undefined
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly top: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined
    ) => Stream.Stream<string, E1 | DockerComposeError, never>;

    readonly unpause: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly up: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services?: Array<string> | undefined,
        options?: UpOptions | undefined
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly version: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        options?: VersionOptions | undefined
    ) => Effect.Effect<string, E1 | DockerComposeError, never>;

    readonly wait: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>,
        services: Array.NonEmptyReadonlyArray<string>,
        options?: WaitOptions | undefined
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly forProject: <E1>(
        project: Stream.Stream<Uint8Array, E1, never>
    ) => Effect.Effect<DockerComposeProject, E1 | DockerComposeError | DockerEngine.DockerError, Scope.Scope>;
}

/**
 * @since 1.0.0
 * @category Tags
 */
export const DockerCompose: Context.Tag<DockerCompose, DockerCompose> = internal.DockerCompose;

/**
 * @since 1.0.0
 * @category Type id
 */
export const DockerComposeProjectTypeId: unique symbol = internal.DockerComposeProjectTypeId;

/**
 * @since 1.0.0
 * @category Type id
 */
export type DockerComposeProjectTypeId = typeof DockerComposeProjectTypeId;

/**
 * @since 1.0.0
 * @category Models
 */
export interface DockerComposeProject {
    readonly [DockerComposeProjectTypeId]: DockerComposeProjectTypeId;

    readonly build: (
        services?: Array<string> | undefined,
        options?: BuildOptions | undefined
    ) => Stream.Stream<string, DockerComposeError, never>;

    readonly config: (
        services?: Array<string> | undefined,
        options?: ConfigOptions | undefined
    ) => Effect.Effect<string, DockerComposeError, never>;

    readonly cpTo: <E1>(
        service: string,
        localSrc: Stream.Stream<Uint8Array, E1, never>,
        remoteDestLocation: string,
        options?: CopyOptions | undefined
    ) => Effect.Effect<void, E1 | DockerComposeError, never>;

    readonly cpFrom: (
        service: string,
        remoteSrcLocation: string,
        options?: CopyOptions | undefined
    ) => Stream.Stream<Uint8Array, DockerComposeError, never>;

    readonly create: (
        services?: Array<string> | undefined,
        options?: CreateOptions | undefined
    ) => Effect.Effect<void, DockerComposeError, never>;

    readonly down: (
        services?: Array<string> | undefined,
        options?: DownOptions | undefined
    ) => Effect.Effect<void, DockerComposeError, never>;

    readonly events: (
        services?: Array<string> | undefined,
        options?: EventsOptions | undefined
    ) => Stream.Stream<string, DockerComposeError, never>;

    readonly exec: (
        service: string,
        command: string,
        args?: Array<string> | undefined,
        options?: ExecOptions | undefined
    ) => Effect.Effect<
        MobyDemux.MultiplexedChannel<never, DockerEngine.DockerError | Socket.SocketError, never>,
        DockerComposeError,
        Scope.Scope
    >;

    readonly images: (
        services?: Array<string> | undefined,
        options?: ImagesOptions | undefined
    ) => Stream.Stream<string, DockerComposeError, never>;

    readonly kill: (
        services?: Array<string> | undefined,
        options?: KillOptions | undefined
    ) => Effect.Effect<void, DockerComposeError, never>;

    readonly logs: (
        services?: Array<string> | undefined,
        options?: LogsOptions | undefined
    ) => Stream.Stream<string, DockerComposeError, never>;

    readonly ls: (options?: ListOptions | undefined) => Stream.Stream<string, DockerComposeError, never>;

    readonly pause: (services?: Array<string> | undefined) => Effect.Effect<void, DockerComposeError, never>;

    readonly port: (
        service: string,
        privatePort: number,
        options?: PortOptions | undefined
    ) => Effect.Effect<number, DockerComposeError, never>;

    readonly ps: (
        services?: Array<string> | undefined,
        options?: PsOptions | undefined
    ) => Stream.Stream<string, DockerComposeError, never>;

    readonly pull: (
        services?: Array<string> | undefined,
        options?: PullOptions | undefined
    ) => Stream.Stream<string, DockerComposeError, never>;

    readonly push: (
        services?: Array<string> | undefined,
        options?: PushOptions | undefined
    ) => Effect.Effect<void, DockerComposeError, never>;

    readonly restart: (
        services?: Array<string> | undefined,
        options?: RestartOptions | undefined
    ) => Effect.Effect<void, DockerComposeError, never>;

    readonly rm: (
        services?: Array<string> | undefined,
        options?: RmOptions | undefined
    ) => Effect.Effect<void, DockerComposeError, never>;

    readonly run: (
        service: string,
        command: string,
        args?: Array<string> | undefined,
        options?: RunOptions | undefined
    ) => Effect.Effect<
        MobyDemux.MultiplexedChannel<never, DockerEngine.DockerError | Socket.SocketError, never>,
        DockerComposeError,
        Scope.Scope
    >;

    readonly start: (services?: Array<string> | undefined) => Effect.Effect<void, DockerComposeError, never>;

    readonly stop: (
        services?: Array<string> | undefined,
        options?: StopOptions | undefined
    ) => Effect.Effect<void, DockerComposeError, never>;

    readonly top: (services?: Array<string> | undefined) => Stream.Stream<string, DockerComposeError, never>;

    readonly unpause: (services?: Array<string> | undefined) => Effect.Effect<void, DockerComposeError, never>;

    readonly up: (
        services?: Array<string> | undefined,
        options?: UpOptions | undefined
    ) => Effect.Effect<void, DockerComposeError, never>;

    readonly version: (options?: VersionOptions | undefined) => Stream.Stream<string, DockerComposeError, never>;

    readonly wait: (
        services: Array.NonEmptyReadonlyArray<string>,
        options?: WaitOptions | undefined
    ) => Effect.Effect<void, DockerComposeError, never>;
}

/**
 * @since 1.0.0
 * @category Layers
 */
export const layer: (
    options?: { dockerEngineSocket?: string | undefined } | undefined
) => Layer.Layer<
    DockerCompose,
    DockerEngine.DockerError,
    MobyEndpoints.Containers | MobyEndpoints.System | MobyEndpoints.Images
> = internal.layer;

/**
 * @since 1.0.0
 * @category Layers
 */
export const layerProject: <E1>(
    project: Stream.Stream<Uint8Array, E1, never>,
    tagIdentifier: string
) => {
    readonly tag: Context.Tag<DockerComposeProject, DockerComposeProject>;
    readonly layer: Layer.Layer<
        DockerComposeProject,
        E1 | internal.DockerComposeError | DockerEngine.DockerError,
        DockerCompose
    >;
} = internal.layerProject;
