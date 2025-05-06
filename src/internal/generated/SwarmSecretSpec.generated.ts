import * as Schema from "effect/Schema";
import * as SwarmAnnotations from "./SwarmAnnotations.generated.js";
import * as SwarmDriver from "./SwarmDriver.generated.js";

export class SwarmSecretSpec extends Schema.Class<SwarmSecretSpec>("SwarmSecretSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        Data: Schema.optionalWith(Schema.StringFromBase64, { nullable: true }),
        Driver: Schema.optionalWith(SwarmDriver.SwarmDriver, { nullable: true }),
        Templating: Schema.optionalWith(SwarmDriver.SwarmDriver, { nullable: true }),
    },
    {
        identifier: "SwarmSecretSpec",
        title: "swarm.SecretSpec",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/secret.go#L12-L35",
    }
) {}
