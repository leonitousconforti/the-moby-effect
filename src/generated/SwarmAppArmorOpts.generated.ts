import * as Schema from "@effect/schema/Schema";

export class SwarmAppArmorOpts extends Schema.Class<SwarmAppArmorOpts>("SwarmAppArmorOpts")(
    {
        Mode: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmAppArmorOpts",
        title: "swarm.AppArmorOpts",
    }
) {}
