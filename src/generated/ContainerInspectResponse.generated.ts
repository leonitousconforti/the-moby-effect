import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerInspectResponse extends Schema.Class<ContainerInspectResponse>("ContainerInspectResponse")(
    {
        Id: Schema.String,
        Names: Schema.NullOr(Schema.Array(Schema.String)),
        Image: Schema.String,
        ImageID: Schema.String,
        Command: Schema.String,
        Created: MobySchemas.Int64,
        Ports: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.Port))),
        SizeRw: Schema.optional(MobySchemas.Int64),
        SizeRootFs: Schema.optional(MobySchemas.Int64),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        State: Schema.String,
        Status: Schema.String,
        HostConfig: Schema.Struct({
            NetworkMode: Schema.optional(Schema.String),
            Annotations: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        }),
        NetworkSettings: Schema.NullOr(MobySchemasGenerated.SummaryNetworkSettings),
        Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.MountPoint))),
    },
    {
        identifier: "ContainerInspectResponse",
        title: "types.Container",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/types.go#L140-L161",
    }
) {}
