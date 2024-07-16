import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmNodeDescription extends Schema.Class<SwarmNodeDescription>("SwarmNodeDescription")(
    {
        Hostname: Schema.optional(Schema.String),
        Platform: Schema.optional(MobySchemasGenerated.SwarmPlatform),
        Resources: Schema.optional(MobySchemasGenerated.SwarmResources),
        Engine: Schema.optional(MobySchemasGenerated.SwarmEngineDescription),
        TLSInfo: Schema.optional(MobySchemasGenerated.SwarmTLSInfo),
        CSIInfo: Schema.optional(Schema.Array(MobySchemasGenerated.SwarmNodeCSIInfo), { nullable: true }),
    },
    {
        identifier: "SwarmNodeDescription",
        title: "swarm.NodeDescription",
    }
) {}
