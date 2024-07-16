import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmEngineDescription extends Schema.Class<SwarmEngineDescription>("SwarmEngineDescription")(
    {
        EngineVersion: Schema.optional(Schema.String),
        Labels: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        Plugins: Schema.optional(Schema.Array(MobySchemasGenerated.SwarmPluginDescription), { nullable: true }),
    },
    {
        identifier: "SwarmEngineDescription",
        title: "swarm.EngineDescription",
    }
) {}
