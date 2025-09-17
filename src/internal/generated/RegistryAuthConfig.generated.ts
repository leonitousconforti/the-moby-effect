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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/registry#AuthConfig",
    }
) {}
