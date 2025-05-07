import * as Schema from "effect/Schema";

export class IDResponse extends Schema.Class<IDResponse>("IDResponse")(
    {
        Id: Schema.String,
    },
    {
        identifier: "IDResponse",
        title: "common.IDResponse",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/common/id_response.go#L6-L13",
    }
) {}
