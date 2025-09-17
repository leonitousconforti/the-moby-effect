import * as Schema from "effect/Schema";

export class ContainerCreateResponse extends Schema.Class<ContainerCreateResponse>("ContainerCreateResponse")(
    {
        Id: Schema.String,
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ContainerCreateResponse",
        title: "container.CreateResponse",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#CreateResponse",
    }
) {}
