import * as Schema from "@effect/schema/Schema";

export class ContainerStats extends Schema.Class<ContainerStats>("ContainerStats")({
    Body: object,
    OSType: Schema.String,
}) {}
