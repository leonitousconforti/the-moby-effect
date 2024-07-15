import * as Schema from "@effect/schema/Schema";

export class ContainerRemoveOptions extends Schema.Class<ContainerRemoveOptions>("ContainerRemoveOptions")(
    {
        RemoveVolumes: Schema.NullOr(Schema.Boolean),
        RemoveLinks: Schema.NullOr(Schema.Boolean),
        Force: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "ContainerRemoveOptions",
        title: "types.ContainerRemoveOptions",
    }
) {}
