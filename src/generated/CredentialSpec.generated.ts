import * as Schema from "@effect/schema/Schema";

export class CredentialSpec extends Schema.Class<CredentialSpec>("CredentialSpec")(
    {
        Config: Schema.NullOr(Schema.String),
        File: Schema.NullOr(Schema.String),
        Registry: Schema.NullOr(Schema.String),
    },
    {
        identifier: "CredentialSpec",
        title: "swarm.CredentialSpec",
    }
) {}
