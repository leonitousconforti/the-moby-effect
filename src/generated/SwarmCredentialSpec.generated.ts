import * as Schema from "effect/Schema";

export class SwarmCredentialSpec extends Schema.Class<SwarmCredentialSpec>("SwarmCredentialSpec")(
    {
        Config: Schema.String,
        File: Schema.String,
        Registry: Schema.String,
    },
    {
        identifier: "SwarmCredentialSpec",
        title: "swarm.CredentialSpec",
        documentation:
            "https://github.com/moby/moby/blob/2b1097f08088fd387a01c6d6a2a0f6916a39b872/api/types/swarm/container.go#L70-L75",
    }
) {}
