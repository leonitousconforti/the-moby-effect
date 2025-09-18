import * as Schema from "effect/Schema";

export class SwarmAppArmorOpts extends Schema.Class<SwarmAppArmorOpts>("SwarmAppArmorOpts")(
    {
        Mode: Schema.optional(Schema.Literal("default", "disabled")),
    },
    {
        identifier: "SwarmAppArmorOpts",
        title: "swarm.AppArmorOpts",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#AppArmorOpts",
    }
) {}
