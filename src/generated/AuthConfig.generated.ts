import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class AuthConfig extends Schema.Class<AuthConfig>("AuthConfig")(
    {
        Username: Schema.String,
        Password: Schema.String,
        Auth: Schema.String,
        Email: Schema.String,
        ServerAddress: Schema.String,
        IdentityToken: Schema.String,
        RegistryToken: Schema.String,
    },
    {
        identifier: "AuthConfig",
        title: "registry.AuthConfig",
    }
) {}
