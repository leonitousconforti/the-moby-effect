import * as Schema from "@effect/schema/Schema";

export class SwarmConfigCreateResponse extends Schema.Class<SwarmConfigCreateResponse>("SwarmConfigCreateResponse")(
    {
        ID: Schema.String,
    },
    {
        identifier: "SwarmConfigCreateResponse",
        title: "types.ConfigCreateResponse",
    }
) {}
