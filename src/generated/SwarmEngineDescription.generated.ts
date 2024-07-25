import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmEngineDescription extends Schema.Class<SwarmEngineDescription>("SwarmEngineDescription")(
    {
        EngineVersion: Schema.optional(Schema.String),
        Labels: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
        Plugins: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmPluginDescription)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmEngineDescription",
        title: "swarm.EngineDescription",
    }
) {}
