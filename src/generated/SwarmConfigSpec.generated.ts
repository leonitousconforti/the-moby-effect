import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmConfigSpec extends Schema.Class<SwarmConfigSpec>("SwarmConfigSpec")(
    {
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
        Data: Schema.optionalWith(Schema.Array(MobySchemas.UInt8), { nullable: true }),
        Templating: Schema.optionalWith(MobySchemasGenerated.SwarmDriver, { nullable: true }),
    },
    {
        identifier: "SwarmConfigSpec",
        title: "swarm.ConfigSpec",
    }
) {}
