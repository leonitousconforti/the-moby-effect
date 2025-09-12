import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerHealthConfig from "./ContainerHealthConfig.generated.js";
import * as ContainerHostConfig from "./ContainerHostConfig.generated.js";
import * as NetworkNetworkingConfig from "./NetworkNetworkingConfig.generated.js";

export class ContainerCreateRequest extends Schema.Class<ContainerCreateRequest>("ContainerCreateRequest")(
    {
        Hostname: Schema.String,
        Domainname: Schema.String,
        User: Schema.String,
        AttachStdin: Schema.Boolean,
        AttachStdout: Schema.Boolean,
        AttachStderr: Schema.Boolean,
        ExposedPorts: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.Object }), {
            nullable: true,
        }),
        Tty: Schema.Boolean,
        OpenStdin: Schema.Boolean,
        StdinOnce: Schema.Boolean,
        Env: Schema.NullOr(Schema.Array(Schema.String)),
        Cmd: Schema.NullOr(Schema.Array(Schema.String)),
        Healthcheck: Schema.optionalWith(ContainerHealthConfig.ContainerHealthConfig, { nullable: true }),
        ArgsEscaped: Schema.optional(Schema.Boolean),
        Image: Schema.String,
        Volumes: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.Object })),
        WorkingDir: Schema.String,
        Entrypoint: Schema.NullOr(Schema.Array(Schema.String)),
        NetworkDisabled: Schema.optional(Schema.Boolean),
        MacAddress: Schema.optional(Schema.String),
        OnBuild: Schema.NullOr(Schema.Array(Schema.String)),
        Labels: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        StopSignal: Schema.optional(Schema.String),
        StopTimeout: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
        Shell: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        HostConfig: Schema.optionalWith(ContainerHostConfig.ContainerHostConfig, { nullable: true }),
        NetworkingConfig: Schema.optionalWith(NetworkNetworkingConfig.NetworkNetworkingConfig, { nullable: true }),
    },
    {
        identifier: "ContainerCreateRequest",
        title: "container.CreateRequest",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/create_request.go#L5-L13",
    }
) {}
