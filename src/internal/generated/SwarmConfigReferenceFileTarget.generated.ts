import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmConfigReferenceFileTarget extends Schema.Class<SwarmConfigReferenceFileTarget>(
    "SwarmConfigReferenceFileTarget"
)(
    {
        Name: Schema.String,
        UID: Schema.String,
        GID: Schema.String,
        Mode: MobySchemas.UInt32,
    },
    {
        identifier: "SwarmConfigReferenceFileTarget",
        title: "swarm.ConfigReferenceFileTarget",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/config.go#L28-L34",
    }
) {}
