import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerConfig extends Schema.Class<ContainerConfig>("ContainerConfig")(
    {
        Hostname: Schema.String,
        Domainname: Schema.String,
        User: Schema.String,
        AttachStdin: Schema.Boolean,
        AttachStdout: Schema.Boolean,
        AttachStderr: Schema.Boolean,
        ExposedPorts: Schema.optional(Schema.Record(Schema.String, Schema.Object), { nullable: true }),
        Tty: Schema.Boolean,
        OpenStdin: Schema.Boolean,
        StdinOnce: Schema.Boolean,
        Env: Schema.NullOr(Schema.Array(Schema.String)),
        Cmd: Schema.NullOr(Schema.Array(Schema.String)),
        Healthcheck: Schema.optional(MobySchemasGenerated.ContainerHealthConfig, { nullable: true }),
        ArgsEscaped: Schema.optional(Schema.Boolean),
        Image: Schema.String,
        Volumes: Schema.NullOr(Schema.Record(Schema.String, Schema.Object)),
        WorkingDir: Schema.String,
        Entrypoint: Schema.NullOr(Schema.Array(Schema.String)),
        NetworkDisabled: Schema.optional(Schema.Boolean),
        MacAddress: Schema.optional(Schema.String),
        OnBuild: Schema.NullOr(Schema.Array(Schema.String)),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        StopSignal: Schema.optional(Schema.String),
        StopTimeout: Schema.optional(MobySchemas.Int64, { nullable: true }),
        Shell: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "ContainerConfig",
        title: "container.Config",
    }
) {}
