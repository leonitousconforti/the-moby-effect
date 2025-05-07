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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/container.go#L70-L75",
    }
) {}
