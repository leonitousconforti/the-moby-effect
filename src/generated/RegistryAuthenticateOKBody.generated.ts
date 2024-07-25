import * as Schema from "@effect/schema/Schema";

export class RegistryAuthenticateOKBody extends Schema.Class<RegistryAuthenticateOKBody>("RegistryAuthenticateOKBody")(
    {
        IdentityToken: Schema.String,
        Status: Schema.String,
    },
    {
        identifier: "RegistryAuthenticateOKBody",
        title: "registry.AuthenticateOKBody",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/registry/authenticate.go#L10-L21",
    }
) {}
