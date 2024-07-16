import * as Schema from "@effect/schema/Schema";

export class SwarmCredentialSpec extends Schema.Class<SwarmCredentialSpec>("SwarmCredentialSpec")(
    {
        Config: Schema.String,
        File: Schema.String,
        Registry: Schema.String,
    },
    {
        identifier: "SwarmCredentialSpec",
        title: "swarm.CredentialSpec",
    }
) {}
