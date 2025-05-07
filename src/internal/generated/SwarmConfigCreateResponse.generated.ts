import * as Schema from "effect/Schema";

export class SwarmConfigCreateResponse extends Schema.Class<SwarmConfigCreateResponse>("SwarmConfigCreateResponse")(
    {
        ID: Schema.String,
    },
    {
        identifier: "SwarmConfigCreateResponse",
        title: "types.ConfigCreateResponse",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/types.go#L117-L122",
    }
) {}
