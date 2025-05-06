import * as Schema from "effect/Schema";

export class SwarmSecretCreateResponse extends Schema.Class<SwarmSecretCreateResponse>("SwarmSecretCreateResponse")(
    {
        ID: Schema.String,
    },
    {
        identifier: "SwarmSecretCreateResponse",
        title: "types.SecretCreateResponse",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/types.go#L105-L110",
    }
) {}
