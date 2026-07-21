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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/registry#AuthenticateOKBody",
    }
) {}
