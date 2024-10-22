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
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/registry/registry.go#L45-L85",
    }
) {}
