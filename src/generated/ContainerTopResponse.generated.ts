import * as Schema from "@effect/schema/Schema";

export class ContainerTopResponse extends Schema.Class<ContainerTopResponse>("ContainerTopResponse")(
    {
        Processes: Schema.NullOr(Schema.Array(Schema.NullOr(Schema.Array(Schema.String)))),
        Titles: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ContainerTopResponse",
        title: "container.ContainerTopOKBody",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/container_top.go#L9-L22",
    }
) {}
