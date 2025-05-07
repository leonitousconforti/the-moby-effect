import * as Schema from "effect/Schema";

export class SwarmConfigReferenceRuntimeTarget extends Schema.Class<SwarmConfigReferenceRuntimeTarget>(
    "SwarmConfigReferenceRuntimeTarget"
)(
    {},
    {
        identifier: "SwarmConfigReferenceRuntimeTarget",
        title: "swarm.ConfigReferenceRuntimeTarget",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/config.go#L36-L38",
    }
) {}
