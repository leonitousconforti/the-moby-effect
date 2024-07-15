import * as Schema from "@effect/schema/Schema";

export class AuthenticateOKBody extends Schema.Class<AuthenticateOKBody>("AuthenticateOKBody")(
    {
        IdentityToken: Schema.NullOr(Schema.String),
        Status: Schema.NullOr(Schema.String),
    },
    {
        identifier: "AuthenticateOKBody",
        title: "registry.AuthenticateOKBody",
    }
) {}
