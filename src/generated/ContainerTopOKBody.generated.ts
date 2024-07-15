import * as Schema from "@effect/schema/Schema";

export class ContainerTopOKBody extends Schema.Class<ContainerTopOKBody>("ContainerTopOKBody")(
    {
        Processes: Schema.NullOr(Schema.Array(Schema.Array(Schema.String))),
        Titles: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ContainerTopOKBody",
        title: "container.ContainerTopOKBody",
    }
) {}
