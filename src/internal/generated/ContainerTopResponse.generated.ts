import * as Schema from "effect/Schema";

export class ContainerTopResponse extends Schema.Class<ContainerTopResponse>("ContainerTopResponse")(
    {
        Processes: Schema.NullOr(Schema.Array(Schema.NullOr(Schema.Array(Schema.String)))),
        Titles: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ContainerTopResponse",
        title: "container.TopResponse",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/top_response.go#L6-L18",
    }
) {}
