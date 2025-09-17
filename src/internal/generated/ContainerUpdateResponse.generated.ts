import * as Schema from "effect/Schema";

export class ContainerUpdateResponse extends Schema.Class<ContainerUpdateResponse>("ContainerUpdateResponse")(
    {
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ContainerUpdateResponse",
        title: "container.UpdateResponse",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#UpdateResponse",
    }
) {}
