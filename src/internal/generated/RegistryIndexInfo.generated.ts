import * as Schema from "effect/Schema";

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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/registry#IndexInfo",
    }
) {}
