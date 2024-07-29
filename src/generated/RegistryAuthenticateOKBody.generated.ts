import * as Schema from "@effect/schema/Schema";
import * as Function from "effect/Function";
import * as Option from "effect/Option";
import * as String from "effect/String";

export class RegistryAuthenticateOKBody extends Schema.Class<RegistryAuthenticateOKBody>("RegistryAuthenticateOKBody")(
    {
        IdentityToken: Schema.requiredToOptional(Schema.String, Schema.String, {
            decode: (s) => (String.isEmpty(s) ? Option.none() : Option.some(s)),
            encode: Option.match({ onNone: () => "" as const, onSome: Function.identity }),
        }),
        Status: Schema.String,
    },
    {
        identifier: "RegistryAuthenticateOKBody",
        title: "registry.AuthenticateOKBody",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/registry/authenticate.go#L10-L21",
    }
) {}
