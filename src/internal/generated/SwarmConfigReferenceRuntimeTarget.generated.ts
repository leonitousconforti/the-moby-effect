import * as Schema from "effect/Schema";

export class SwarmConfigReferenceRuntimeTarget extends Schema.Class<SwarmConfigReferenceRuntimeTarget>(
    "SwarmConfigReferenceRuntimeTarget"
)(
    {},
    {
        identifier: "SwarmConfigReferenceRuntimeTarget",
        title: "swarm.ConfigReferenceRuntimeTarget",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ConfigReferenceRuntimeTarget",
    }
) {}
