import * as Schema from "effect/Schema";

export class SwarmSpreadOver extends Schema.Class<SwarmSpreadOver>("SwarmSpreadOver")(
    {
        SpreadDescriptor: Schema.String,
    },
    {
        identifier: "SwarmSpreadOver",
        title: "swarm.SpreadOver",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#SpreadOver",
    }
) {}
