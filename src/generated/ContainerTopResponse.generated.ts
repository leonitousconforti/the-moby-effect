import * as Schema from "@effect/schema/Schema";

export class ContainerTopResponse extends Schema.Class<ContainerTopResponse>("ContainerTopResponse")(
    {
        Processes: Schema.NullOr(Schema.Array(Schema.Array(Schema.String))),
        Titles: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ContainerTopResponse",
        title: "container.ContainerTopOKBody",
    }
) {}
