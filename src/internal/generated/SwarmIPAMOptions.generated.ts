import * as Schema from "effect/Schema";
import * as SwarmDriver from "./SwarmDriver.generated.js";
import * as SwarmIPAMConfig from "./SwarmIPAMConfig.generated.js";

export class SwarmIPAMOptions extends Schema.Class<SwarmIPAMOptions>("SwarmIPAMOptions")(
    {
        Driver: Schema.optionalWith(SwarmDriver.SwarmDriver, { nullable: true }),
        Configs: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmIPAMConfig.SwarmIPAMConfig)), { nullable: true }),
    },
    {
        identifier: "SwarmIPAMOptions",
        title: "swarm.IPAMOptions",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#IPAMOptions",
    }
) {}
