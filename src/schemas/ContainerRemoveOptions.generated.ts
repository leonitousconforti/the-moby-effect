import * as Schema from "@effect/schema/Schema";

export class ContainerRemoveOptions extends Schema.Class<ContainerRemoveOptions>("ContainerRemoveOptions")({
    RemoveVolumes: Schema.Boolean,
    RemoveLinks: Schema.Boolean,
    Force: Schema.Boolean,
}) {}
