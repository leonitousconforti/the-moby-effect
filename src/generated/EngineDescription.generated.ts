import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class EngineDescription extends Schema.Class<EngineDescription>("EngineDescription")(
    {
        EngineVersion: Schema.optional(Schema.String, { nullable: true }),
        Labels: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        Plugins: Schema.optional(Schema.Array(MobySchemasGenerated.PluginDescription), { nullable: true }),
    },
    {
        identifier: "EngineDescription",
        title: "swarm.EngineDescription",
    }
) {}
