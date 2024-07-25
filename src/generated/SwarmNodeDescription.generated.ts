import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmNodeDescription extends Schema.Class<SwarmNodeDescription>("SwarmNodeDescription")(
    {
        Hostname: Schema.optional(Schema.String),
        Platform: Schema.optionalWith(MobySchemasGenerated.SwarmPlatform, { nullable: true }),
        Resources: Schema.optionalWith(MobySchemasGenerated.SwarmResources, { nullable: true }),
        Engine: Schema.optionalWith(MobySchemasGenerated.SwarmEngineDescription, { nullable: true }),
        TLSInfo: Schema.optionalWith(MobySchemasGenerated.SwarmTLSInfo, { nullable: true }),
        CSIInfo: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmNodeCSIInfo)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmNodeDescription",
        title: "swarm.NodeDescription",
    }
) {}
