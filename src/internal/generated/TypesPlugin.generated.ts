import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as TypesPluginConfig from "./TypesPluginConfig.generated.js";
import * as TypesPluginSettings from "./TypesPluginSettings.generated.js";

export class TypesPlugin extends Schema.Class<TypesPlugin>("TypesPlugin")(
    {
        Config: Schema.NullOr(TypesPluginConfig.TypesPluginConfig),
        Enabled: Schema.Boolean,
        Id: Schema.optional(MobySchemas.PluginIdentifier),
        Name: Schema.String,
        PluginReference: Schema.optional(Schema.String),
        Settings: Schema.NullOr(TypesPluginSettings.TypesPluginSettings),
    },
    {
        identifier: "TypesPlugin",
        title: "types.Plugin",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#Plugin",
    }
) {}
