import * as Schema from "@effect/schema/Schema";

export class ContainerTopOKBody extends Schema.Class<ContainerTopOKBody>("ContainerTopOKBody")({
    Processes: Schema.Array(Schema.Array(Schema.String)),
    Titles: Schema.Array(Schema.String),
}) {}
