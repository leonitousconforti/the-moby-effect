import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ContainerPort extends Schema.Class<ContainerPort>("ContainerPort")(
    {
        IP: Schema.optional(Schema.String),
        PrivatePort: EffectSchemas.Number.U16,
        PublicPort: Schema.optional(EffectSchemas.Number.U16),
        Type: Schema.String,
    },
    {
        identifier: "ContainerPort",
        title: "container.Port",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#Port",
    }
) {}
