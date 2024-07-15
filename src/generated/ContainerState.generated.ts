import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerState extends Schema.Class<ContainerState>("ContainerState")(
    {
        Status: Schema.NullOr(Schema.String),
        Running: Schema.NullOr(Schema.Boolean),
        Paused: Schema.NullOr(Schema.Boolean),
        Restarting: Schema.NullOr(Schema.Boolean),
        OOMKilled: Schema.NullOr(Schema.Boolean),
        Dead: Schema.NullOr(Schema.Boolean),
        Pid: Schema.NullOr(MobySchemas.Int64),
        ExitCode: Schema.NullOr(MobySchemas.Int64),
        Error: Schema.NullOr(Schema.String),
        StartedAt: Schema.NullOr(Schema.String),
        FinishedAt: Schema.NullOr(Schema.String),
        Health: Schema.optional(MobySchemasGenerated.Health, { nullable: true }),
    },
    {
        identifier: "ContainerState",
        title: "types.ContainerState",
    }
) {}
