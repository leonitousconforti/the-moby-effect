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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#TopResponse",
    }
) {}
