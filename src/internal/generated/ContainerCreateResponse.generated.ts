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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/create_response.go#L6-L19",
    }
) {}
