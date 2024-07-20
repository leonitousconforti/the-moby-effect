import * as Schema from "@effect/schema/Schema";

export class RegistryAuthenticateOKBody extends Schema.Class<RegistryAuthenticateOKBody>("RegistryAuthenticateOKBody")(
    {
        IdentityToken: Schema.String,
        Status: Schema.String,
    },
    {
        identifier: "RegistryAuthenticateOKBody",
        title: "registry.AuthenticateOKBody",
    }
) {}
