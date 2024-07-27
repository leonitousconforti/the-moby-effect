import * as Schema from "@effect/schema/Schema";

export class SwarmAppArmorOpts extends Schema.Class<SwarmAppArmorOpts>("SwarmAppArmorOpts")(
    {
        Mode: Schema.optional(Schema.Literal("default", "disabled")),
    },
    {
        identifier: "SwarmAppArmorOpts",
        title: "swarm.AppArmorOpts",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/container.go#L64-L68",
    }
) {}
