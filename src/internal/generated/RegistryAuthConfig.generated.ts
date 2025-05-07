import * as Schema from "effect/Schema";

export class RegistryAuthConfig extends Schema.Class<RegistryAuthConfig>("RegistryAuthConfig")(
    {
        username: Schema.optional(Schema.String),
        password: Schema.optional(Schema.String),
        auth: Schema.optional(Schema.String),
        email: Schema.optional(Schema.String),
        serveraddress: Schema.optional(Schema.String),
        identitytoken: Schema.optional(Schema.String),
        registrytoken: Schema.optional(Schema.String),
    },
    {
        identifier: "RegistryAuthConfig",
        title: "registry.AuthConfig",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/registry/authconfig.go#L27-L46",
    }
) {}
