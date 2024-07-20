import * as Schema from "@effect/schema/Schema";

export class SwarmServiceCreateResponse extends Schema.Class<SwarmServiceCreateResponse>("SwarmServiceCreateResponse")(
    {
        ID: Schema.optional(Schema.String),
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "SwarmServiceCreateResponse",
        title: "swarm.ServiceCreateResponse",
    }
) {}
