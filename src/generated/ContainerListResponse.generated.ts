import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerListResponse extends Schema.Class<ContainerListResponse>("ContainerListResponse")(
    {
        Id: Schema.String,
        Names: Schema.NullOr(Schema.Array(Schema.String)),
        Image: Schema.String,
        ImageID: Schema.String,
        Command: Schema.String,
        Created: MobySchemas.Int64,
        Ports: Schema.NullOr(Schema.Array(MobySchemasGenerated.Port)),
        SizeRw: Schema.optional(MobySchemas.Int64),
        SizeRootFs: Schema.optional(MobySchemas.Int64),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        State: Schema.String,
        Status: Schema.String,
        HostConfig: Schema.Struct({
            NetworkMode: Schema.optional(Schema.String),
        }),
        NetworkSettings: Schema.NullOr(MobySchemasGenerated.SummaryNetworkSettings),
        Mounts: Schema.NullOr(Schema.Array(MobySchemasGenerated.MountPoint)),
    },
    {
        identifier: "ContainerListResponse",
        title: "types.Container",
    }
) {}
