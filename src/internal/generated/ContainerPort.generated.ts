import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class ContainerPort extends Schema.Class<ContainerPort>("ContainerPort")(
    {
        IP: Schema.optional(Schema.String),
        PrivatePort: MobyNumber.NumberFromWireString.check(
            Schema.isInt(),
            Schema.isBetween({ minimum: 0, maximum: 2 ** 16 - 1 })
        ),
        PublicPort: Schema.optional(
            MobyNumber.NumberFromWireString.check(
                Schema.isInt(),
                Schema.isBetween({ minimum: 0, maximum: 2 ** 16 - 1 })
            )
        ),
        Type: Schema.String,
    },
    {
        identifier: "ContainerPort",
        title: "container.Port",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#Port",
    }
) {}
