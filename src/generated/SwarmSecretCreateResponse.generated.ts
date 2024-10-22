import * as Schema from "effect/Schema";

export class SwarmSecretCreateResponse extends Schema.Class<SwarmSecretCreateResponse>("SwarmSecretCreateResponse")(
    {
        ID: Schema.String,
    },
    {
        identifier: "SwarmSecretCreateResponse",
        title: "types.SecretCreateResponse",
        documentation:
            "https://github.com/moby/moby/blob/951a04cc01b2d6d9c8c45ad04cd5a03182803c88/api/types/types.go#L105-L110",
    }
) {}
