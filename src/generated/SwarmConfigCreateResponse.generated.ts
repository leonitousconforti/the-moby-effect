import * as Schema from "@effect/schema/Schema";

export class SwarmConfigCreateResponse extends Schema.Class<SwarmConfigCreateResponse>("SwarmConfigCreateResponse")(
    {
        ID: Schema.String,
    },
    {
        identifier: "SwarmConfigCreateResponse",
        title: "types.ConfigCreateResponse",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/types.go#L429-L434",
    }
) {}
