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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ConfigReferenceFileTarget",
    }
) {}
