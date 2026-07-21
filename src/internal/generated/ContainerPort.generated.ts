import * as Schema from "effect/Schema";

export class ContainerPort extends Schema.Class<ContainerPort>("ContainerPort")(
    {
        IP: Schema.optional(Schema.String),
        PrivatePort: Schema.NumberFromString.check(
            Schema.isInt(),
            Schema.isBetween({ minimum: 0, maximum: 2 ** 16 - 1 })
        ),
        PublicPort: Schema.optional(
            Schema.NumberFromString.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 2 ** 16 - 1 }))
        ),
        Type: Schema.String,
    },
    {
        identifier: "ContainerPort",
        title: "container.Port",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#Port",
    }
) {}
