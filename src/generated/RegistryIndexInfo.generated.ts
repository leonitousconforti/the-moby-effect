import * as Schema from "@effect/schema/Schema";

export class RegistryIndexInfo extends Schema.Class<RegistryIndexInfo>("RegistryIndexInfo")(
    {
        Name: Schema.String,
        Mirrors: Schema.NullOr(Schema.Array(Schema.String)),
        Secure: Schema.Boolean,
        Official: Schema.Boolean,
    },
    {
        identifier: "RegistryIndexInfo",
        title: "registry.IndexInfo",
    }
) {}
