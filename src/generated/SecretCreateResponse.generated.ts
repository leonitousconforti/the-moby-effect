import * as Schema from "@effect/schema/Schema";

export class SecretCreateResponse extends Schema.Class<SecretCreateResponse>("SecretCreateResponse")(
    {
        ID: Schema.String,
    },
    {
        identifier: "SecretCreateResponse",
        title: "types.SecretCreateResponse",
    }
) {}
