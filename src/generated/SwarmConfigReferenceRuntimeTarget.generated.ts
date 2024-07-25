import * as Schema from "@effect/schema/Schema";

export class SwarmConfigReferenceRuntimeTarget extends Schema.Class<SwarmConfigReferenceRuntimeTarget>(
    "SwarmConfigReferenceRuntimeTarget"
)(
    {},
    {
        identifier: "SwarmConfigReferenceRuntimeTarget",
        title: "swarm.ConfigReferenceRuntimeTarget",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/config.go#L30-L32",
    }
) {}
