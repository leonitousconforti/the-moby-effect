import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as V1HealthcheckConfig from "./V1HealthcheckConfig.generated.js";

export class ContainerConfig extends Schema.Class<ContainerConfig>("ContainerConfig")(
    {
        Hostname: Schema.String,
        Domainname: Schema.String,
        User: Schema.String,
        AttachStdin: Schema.Boolean,
        AttachStdout: Schema.Boolean,
        AttachStderr: Schema.Boolean,
        ExposedPorts: Schema.optionalWith(MobySchemas.PortSet, { nullable: true }),
        Tty: Schema.Boolean,
        OpenStdin: Schema.Boolean,
        StdinOnce: Schema.Boolean,
        Env: Schema.NullOr(Schema.Array(Schema.String)),
        Cmd: Schema.NullOr(Schema.Array(Schema.String)),
        Healthcheck: Schema.optionalWith(V1HealthcheckConfig.V1HealthcheckConfig, { nullable: true }),
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
    },
    {
        identifier: "ContainerConfig",
        title: "container.Config",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#Config",
    }
) {}
