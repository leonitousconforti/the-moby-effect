import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NodeDescription extends Schema.Class<NodeDescription>("NodeDescription")(
    {
        Hostname: Schema.optional(Schema.String, { nullable: true }),
        Platform: Schema.optional(MobySchemasGenerated.Platform),
        Resources: Schema.optional(MobySchemasGenerated.Resources),
        Engine: Schema.optional(MobySchemasGenerated.EngineDescription),
        TLSInfo: Schema.optional(MobySchemasGenerated.TLSInfo),
        CSIInfo: Schema.optional(Schema.Array(MobySchemasGenerated.NodeCSIInfo), { nullable: true }),
    },
    {
        identifier: "NodeDescription",
        title: "swarm.NodeDescription",
    }
) {}
