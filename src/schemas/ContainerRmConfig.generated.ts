import * as Schema from "@effect/schema/Schema";

export class ContainerRmConfig extends Schema.Class<ContainerRmConfig>("ContainerRmConfig")({
    ForceRemove: Schema.Boolean,
    RemoveVolume: Schema.Boolean,
    RemoveLink: Schema.Boolean,
}) {}
