import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmNodeDescription extends Schema.Class<SwarmNodeDescription>("SwarmNodeDescription")(
    {
        Hostname: Schema.optional(Schema.String),
        Platform: Schema.optional(MobySchemasGenerated.SwarmPlatform, { nullable: true }),
        Resources: Schema.optional(MobySchemasGenerated.SwarmResources, { nullable: true }),
        Engine: Schema.optional(MobySchemasGenerated.SwarmEngineDescription, { nullable: true }),
        TLSInfo: Schema.optional(MobySchemasGenerated.SwarmTLSInfo, { nullable: true }),
        CSIInfo: Schema.optional(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmNodeCSIInfo)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmNodeDescription",
        title: "swarm.NodeDescription",
    }
) {}
