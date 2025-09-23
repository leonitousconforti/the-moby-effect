import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerPort extends Schema.Class<ContainerPort>("ContainerPort")(
    {
        IP: Schema.optional(Schema.String),
        PrivatePort: MobySchemas.UInt16,
        PublicPort: Schema.optional(MobySchemas.UInt16),
        Type: Schema.String,
    },
    {
        identifier: "ContainerPort",
        title: "container.Port",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#Port",
    }
) {}
