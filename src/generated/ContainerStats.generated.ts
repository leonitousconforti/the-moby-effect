import * as Schema from "@effect/schema/Schema";

export class ContainerStats extends Schema.Class<ContainerStats>("ContainerStats")(
    {
        body: Schema.Object,
        ostype: Schema.NullOr(Schema.String),
    },
    {
        identifier: "ContainerStats",
        title: "types.ContainerStats",
    }
) {}
