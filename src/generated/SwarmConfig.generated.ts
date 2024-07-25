import * as Schema from "@effect/schema/Schema";
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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/config.go#L5-L10",
    }
) {}
