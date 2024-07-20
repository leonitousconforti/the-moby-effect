import * as Schema from "@effect/schema/Schema";

export class SwarmServiceUpdateResponse extends Schema.Class<SwarmServiceUpdateResponse>("SwarmServiceUpdateResponse")(
    {
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "SwarmServiceUpdateResponse",
        title: "swarm.ServiceUpdateResponse",
    }
) {}
