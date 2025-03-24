import * as Schema from "effect/Schema";

export class IDResponse extends Schema.Class<IDResponse>("IDResponse")(
    {
        Id: Schema.String,
    },
    {
        identifier: "IDResponse",
        title: "types.IDResponse",
        documentation:
            "https://github.com/moby/moby/blob/733755d7cb18a4dbea7c290cc56e61d05502aca0/api/types/id_response.go#L6-L13",
    }
) {}
