import * as Schema from "@effect/schema/Schema";

export class ContainerRmConfig extends Schema.Class<ContainerRmConfig>("ContainerRmConfig")(
    {
        ForceRemove: Schema.NullOr(Schema.Boolean),
        RemoveVolume: Schema.NullOr(Schema.Boolean),
        RemoveLink: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "ContainerRmConfig",
        title: "types.ContainerRmConfig",
    }
) {}
