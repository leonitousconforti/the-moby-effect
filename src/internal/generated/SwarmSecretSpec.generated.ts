import * as Schema from "effect/Schema";

import * as SwarmAnnotations from "./SwarmAnnotations.generated.ts";
import * as SwarmDriver from "./SwarmDriver.generated.ts";

export class SwarmSecretSpec extends Schema.Class<SwarmSecretSpec>("SwarmSecretSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        Data: Schema.optional(Schema.NullOr(Schema.Uint8ArrayFromBase64)),
        Driver: Schema.optional(Schema.NullOr(SwarmDriver.SwarmDriver)),
        Templating: Schema.optional(Schema.NullOr(SwarmDriver.SwarmDriver)),
    },
    {
        identifier: "SwarmSecretSpec",
        title: "swarm.SecretSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#SecretSpec",
    }
) {}
