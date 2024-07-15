import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

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
