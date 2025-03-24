import * as Schema from "effect/Schema";

export class ContainerUpdateResponse extends Schema.Class<ContainerUpdateResponse>("ContainerUpdateResponse")(
    {
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ContainerUpdateResponse",
        title: "container.ContainerUpdateOKBody",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/container_update.go#L9-L16",
    }
) {}
