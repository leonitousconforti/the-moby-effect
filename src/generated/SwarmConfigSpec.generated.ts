import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmConfigSpec extends Schema.Class<SwarmConfigSpec>("SwarmConfigSpec")(
    {
        Name: Schema.optional(Schema.String),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Data: Schema.optional(Schema.Array(MobySchemas.UInt8), { nullable: true }),
        Templating: Schema.optional(MobySchemasGenerated.SwarmDriver, { nullable: true }),
    },
    {
        identifier: "SwarmConfigSpec",
        title: "swarm.ConfigSpec",
    }
) {}
