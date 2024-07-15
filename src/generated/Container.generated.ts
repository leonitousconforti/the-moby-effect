import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class Container extends Schema.Class<Container>("Container")(
    {
        Id: Schema.NullOr(Schema.String),
        Names: Schema.NullOr(Schema.Array(Schema.String)),
        Image: Schema.NullOr(Schema.String),
        ImageID: Schema.NullOr(Schema.String),
        Command: Schema.NullOr(Schema.String),
        Created: Schema.NullOr(MobySchemas.Int64),
        Ports: Schema.NullOr(Schema.Array(MobySchemasGenerated.Port)),
        SizeRw: Schema.optional(MobySchemas.Int64, { nullable: true }),
        SizeRootFs: Schema.optional(MobySchemas.Int64, { nullable: true }),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        State: Schema.NullOr(Schema.String),
        Status: Schema.NullOr(Schema.String),
        NetworkSettings: Schema.NullOr(MobySchemasGenerated.SummaryNetworkSettings),
        Mounts: Schema.NullOr(Schema.Array(MobySchemasGenerated.MountPoint)),
    },
    {
        identifier: "Container",
        title: "types.Container",
    }
) {}
