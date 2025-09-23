import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as SwarmAnnotations from "./SwarmAnnotations.generated.js";
import * as SwarmDriver from "./SwarmDriver.generated.js";

export class SwarmConfigSpec extends Schema.Class<SwarmConfigSpec>("SwarmConfigSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        Data: Schema.optionalWith(Schema.Array(MobySchemas.UInt8), { nullable: true }),
        Templating: Schema.optionalWith(SwarmDriver.SwarmDriver, { nullable: true }),
    },
    {
        identifier: "SwarmConfigSpec",
        title: "swarm.ConfigSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ConfigSpec",
    }
) {}
