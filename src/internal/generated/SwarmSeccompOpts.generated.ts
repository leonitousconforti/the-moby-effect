import * as Schema from "effect/Schema";

export class SwarmSeccompOpts extends Schema.Class<SwarmSeccompOpts>("SwarmSeccompOpts")(
    {
        Mode: Schema.optional(Schema.Literals(["default", "unconfined", "custom"])),
        Profile: Schema.optional(Schema.NullOr(Schema.Uint8ArrayFromBase64)),
    },
    {
        identifier: "SwarmSeccompOpts",
        title: "swarm.SeccompOpts",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#SeccompOpts",
    }
) {}
