import * as Schema from "effect/Schema";
import * as SwarmConfigSpec from "./SwarmConfigSpec.generated.js";
import * as SwarmMeta from "./SwarmMeta.generated.js";

export class SwarmConfig extends Schema.Class<SwarmConfig>("SwarmConfig")(
    {
        ID: Schema.String,
        ...SwarmMeta.SwarmMeta.fields,
        Spec: Schema.NullOr(SwarmConfigSpec.SwarmConfigSpec),
    },
    {
        identifier: "SwarmConfig",
        title: "swarm.Config",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/config.go#L5-L10",
    }
) {}
