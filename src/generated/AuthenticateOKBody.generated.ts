import * as Schema from "@effect/schema/Schema";

export class AuthenticateOKBody extends Schema.Class<AuthenticateOKBody>("AuthenticateOKBody")(
    {
        IdentityToken: Schema.String,
        Status: Schema.String,
    },
    {
        identifier: "AuthenticateOKBody",
        title: "registry.AuthenticateOKBody",
    }
) {}
