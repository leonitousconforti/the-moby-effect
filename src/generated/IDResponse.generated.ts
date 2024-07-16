import * as Schema from "@effect/schema/Schema";

export class IDResponse extends Schema.Class<IDResponse>("IDResponse")(
    {
        Id: Schema.String,
    },
    {
        identifier: "IDResponse",
        title: "types.IDResponse",
    }
) {}
