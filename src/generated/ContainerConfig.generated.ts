import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerHealthConfig from "./ContainerHealthConfig.generated.js";

export class ContainerConfig extends Schema.Class<ContainerConfig>("ContainerConfig")(
    {
        /** Hostname */
        Hostname: Schema.String,

        /** Domainname */
        Domainname: Schema.String,

        /**
         * User that will run the command(s) inside the container, also support
         * user:group
         */
        User: Schema.String,

        /** Attach the standard input, makes possible user interaction */
        AttachStdin: Schema.Boolean,

        /** Attach the standard output */
        AttachStdout: Schema.Boolean,

        /** Attach the standard error */
        AttachStderr: Schema.Boolean,

        /** List of exposed ports */
        ExposedPorts: Schema.optionalWith(MobySchemas.PortSchemas.PortSet, { nullable: true }),

        /**
         * Attach standard streams to a tty, including stdin if it is not
         * closed.
         */
        Tty: Schema.Boolean,

        /** Open stdin */
        OpenStdin: Schema.Boolean,

        /** If true, close stdin after the 1 attached client disconnects. */
        StdinOnce: Schema.Boolean,

        /** List of environment variable to set in the container */
        Env: Schema.NullOr(Schema.Array(Schema.String)),

        /** Command to run when starting the container */
        Cmd: Schema.NullOr(Schema.Array(Schema.String)),

        /** Healthcheck describes how to check the container is healthy */
        Healthcheck: Schema.optionalWith(ContainerHealthConfig.ContainerHealthConfig, { nullable: true }),

        /**
         * True if command is already escaped (meaning treat as a command line)
         * (Windows specific).
         */
        ArgsEscaped: Schema.optional(Schema.Boolean),

        /**
         * Name of the image as it was passed by the operator (e.g. could be
         * symbolic)
         */
        Image: Schema.String,

        /** List of volumes (mounts) used for the container */
        Volumes: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.Object,
            })
        ),

        /** Current directory (PWD) in the command will be launched */
        WorkingDir: Schema.String,

        /** Entrypoint to run when starting the container */
        Entrypoint: Schema.NullOr(Schema.Array(Schema.String)),

        /** Is network disabled */
        NetworkDisabled: Schema.optional(Schema.Boolean),

        /**
         * Mac Address of the container. Deprecated: this field is deprecated
         * since API v1.44. Use EndpointSettings.MacAddress instead.
         */
        MacAddress: Schema.optional(Schema.String),

        /** ONBUILD metadata that were defined on the image Dockerfile */
        OnBuild: Schema.NullOr(Schema.Array(Schema.String)),

        /** List of labels set to this container */
        Labels: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),

        /** Signal to stop a container */
        StopSignal: Schema.optional(Schema.String),

        /** Timeout (in seconds) to stop a container */
        StopTimeout: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),

        /** Shell for shell-form of RUN, CMD, ENTRYPOINT */
        Shell: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "ContainerConfig",
        title: "container.Config",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/config.go#L38-L73",
    }
) {}
