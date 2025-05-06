import * as Schema from "effect/Schema";

export class SwarmServiceCreateResponse extends Schema.Class<SwarmServiceCreateResponse>("SwarmServiceCreateResponse")(
    {
        ID: Schema.optional(Schema.String),
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "SwarmServiceCreateResponse",
        title: "swarm.ServiceCreateResponse",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/service_create_response.go#L6-L20",
    }
) {}
