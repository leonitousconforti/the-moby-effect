import * as Schema from "effect/Schema";

export class SwarmSpreadOver extends Schema.Class<SwarmSpreadOver>("SwarmSpreadOver")(
    {
        SpreadDescriptor: Schema.String,
    },
    {
        identifier: "SwarmSpreadOver",
        title: "swarm.SpreadOver",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/task.go#L163-L168",
    }
) {}
