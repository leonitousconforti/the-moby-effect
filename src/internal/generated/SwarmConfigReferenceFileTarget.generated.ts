import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class SwarmConfigReferenceFileTarget extends Schema.Class<SwarmConfigReferenceFileTarget>(
    "SwarmConfigReferenceFileTarget"
)(
    {
        Name: Schema.String,
        UID: Schema.String,
        GID: Schema.String,
        Mode: EffectSchemas.Number.U32,
    },
    {
        identifier: "SwarmConfigReferenceFileTarget",
        title: "swarm.ConfigReferenceFileTarget",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ConfigReferenceFileTarget",
    }
) {}
