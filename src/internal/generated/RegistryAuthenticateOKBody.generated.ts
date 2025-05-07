import * as Schema from "effect/Schema";

export class RegistryAuthenticateOKBody extends Schema.Class<RegistryAuthenticateOKBody>("RegistryAuthenticateOKBody")(
    {
        IdentityToken: Schema.String,
        Status: Schema.String,
    },
    {
        identifier: "RegistryAuthenticateOKBody",
        title: "registry.AuthenticateOKBody",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/registry/authenticate.go#L10-L21",
    }
) {}
