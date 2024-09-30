import * as Schema from "@effect/schema/Schema";

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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/registry/authconfig.go#L15-L34",
    }
) {}
