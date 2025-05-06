import * as Schema from "effect/Schema";

export class SwarmSpreadOver extends Schema.Class<SwarmSpreadOver>("SwarmSpreadOver")(
    {
        SpreadDescriptor: Schema.String,
    },
    {
        identifier: "SwarmSpreadOver",
        title: "swarm.SpreadOver",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/task.go#L163-L168",
    }
) {}
