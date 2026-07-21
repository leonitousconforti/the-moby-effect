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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#CredentialSpec",
    }
) {}
