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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/create_response.go#L6-L19",
    }
) {}
