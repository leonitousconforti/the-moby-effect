import * as Schema from "effect/Schema";

export class ContainerUpdateResponse extends Schema.Class<ContainerUpdateResponse>("ContainerUpdateResponse")(
    {
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ContainerUpdateResponse",
        title: "container.UpdateResponse",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/update_response.go#L6-L14",
    }
) {}
