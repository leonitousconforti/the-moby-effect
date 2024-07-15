import * as Schema from "@effect/schema/Schema";

export class AuthConfig extends Schema.Class<AuthConfig>("AuthConfig")(
    {
        username: Schema.optional(Schema.String, { nullable: true }),
        password: Schema.optional(Schema.String, { nullable: true }),
        auth: Schema.optional(Schema.String, { nullable: true }),
        email: Schema.optional(Schema.String, { nullable: true }),
        serveraddress: Schema.optional(Schema.String, { nullable: true }),
        identitytoken: Schema.optional(Schema.String, { nullable: true }),
        registrytoken: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "AuthConfig",
        title: "registry.AuthConfig",
    }
) {}
