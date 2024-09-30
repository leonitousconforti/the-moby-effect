import * as Schema from "@effect/schema/Schema";

export class SwarmServiceCreateResponse extends Schema.Class<SwarmServiceCreateResponse>("SwarmServiceCreateResponse")(
    {
        ID: Schema.optional(Schema.String),
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "SwarmServiceCreateResponse",
        title: "swarm.ServiceCreateResponse",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/service_create_response.go#L6-L20",
    }
) {}
