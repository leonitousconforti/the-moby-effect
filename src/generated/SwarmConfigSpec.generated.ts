import * as Schema from "effect/Schema";
import * as SwarmAnnotations from "./SwarmAnnotations.generated.js";
import * as SwarmDriver from "./SwarmDriver.generated.js";

export class SwarmConfigSpec extends Schema.Class<SwarmConfigSpec>("SwarmConfigSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        Data: Schema.optionalWith(Schema.StringFromBase64, { nullable: true }),
        Templating: Schema.optionalWith(SwarmDriver.SwarmDriver, { nullable: true }),
    },
    {
        identifier: "SwarmConfigSpec",
        title: "swarm.ConfigSpec",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/config.go#L12-L20",
    }
) {}
