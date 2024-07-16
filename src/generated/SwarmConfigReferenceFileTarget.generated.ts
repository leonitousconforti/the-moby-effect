import * as Schema from "@effect/schema/Schema";
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
    }
) {}
