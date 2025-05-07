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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/registry/registry.go#L71-L111",
    }
) {}
