import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as SwarmAnnotations from "./SwarmAnnotations.generated.js";
import * as SwarmDriver from "./SwarmDriver.generated.js";

export class SwarmSecretSpec extends Schema.Class<SwarmSecretSpec>("SwarmSecretSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        Data: Schema.optionalWith(Schema.Array(MobySchemas.UInt8), { nullable: true }),
        Driver: Schema.optionalWith(SwarmDriver.SwarmDriver, { nullable: true }),
        Templating: Schema.optionalWith(SwarmDriver.SwarmDriver, { nullable: true }),
    },
    {
        identifier: "SwarmSecretSpec",
        title: "swarm.SecretSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#SecretSpec",
    }
) {}
