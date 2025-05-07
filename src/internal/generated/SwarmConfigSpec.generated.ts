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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/config.go#L12-L26",
    }
) {}
