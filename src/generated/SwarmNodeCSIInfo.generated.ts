import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmNodeCSIInfo extends Schema.Class<SwarmNodeCSIInfo>("SwarmNodeCSIInfo")(
    {
        PluginName: Schema.optional(Schema.String),
        NodeID: Schema.optional(Schema.String),
        MaxVolumesPerNode: Schema.optional(MobySchemas.Int64),
        AccessibleTopology: Schema.optionalWith(MobySchemasGenerated.SwarmTopology, { nullable: true }),
    },
    {
        identifier: "SwarmNodeCSIInfo",
        title: "swarm.NodeCSIInfo",
    }
) {}
