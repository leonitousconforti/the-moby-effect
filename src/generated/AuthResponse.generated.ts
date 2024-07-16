import * as Schema from "@effect/schema/Schema";

export class AuthResponse extends Schema.Class<AuthResponse>("AuthResponse")(
    {
        IdentityToken: Schema.String,
        Status: Schema.String,
    },
    {
        identifier: "AuthResponse",
        title: "registry.AuthenticateOKBody",
    }
) {}
