import * as Schema from "effect/Schema";

import * as SwarmDriver from "./SwarmDriver.generated.ts";
import * as SwarmIPAMConfig from "./SwarmIPAMConfig.generated.ts";

export class SwarmIPAMOptions extends Schema.Class<SwarmIPAMOptions>("SwarmIPAMOptions")(
    {
        Driver: Schema.optional(Schema.NullOr(SwarmDriver.SwarmDriver)),
        Configs: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(SwarmIPAMConfig.SwarmIPAMConfig)))),
    },
    {
        identifier: "SwarmIPAMOptions",
        title: "swarm.IPAMOptions",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#IPAMOptions",
    }
) {}
