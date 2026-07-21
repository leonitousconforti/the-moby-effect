import * as Schema from "effect/Schema";

import * as SwarmAnnotations from "./SwarmAnnotations.generated.ts";
import * as SwarmDriver from "./SwarmDriver.generated.ts";

export class SwarmConfigSpec extends Schema.Class<SwarmConfigSpec>("SwarmConfigSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        Data: Schema.optional(Schema.NullOr(Schema.Uint8ArrayFromBase64)),
        Templating: Schema.optional(Schema.NullOr(SwarmDriver.SwarmDriver)),
    },
    {
        identifier: "SwarmConfigSpec",
        title: "swarm.ConfigSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ConfigSpec",
    }
) {}
