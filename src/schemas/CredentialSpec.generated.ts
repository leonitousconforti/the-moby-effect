import * as Schema from "@effect/schema/Schema";

export class CredentialSpec extends Schema.Class<CredentialSpec>("CredentialSpec")({
    Config: Schema.String,
    File: Schema.String,
    Registry: Schema.String,
}) {}
