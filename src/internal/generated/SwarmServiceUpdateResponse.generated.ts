import * as Schema from "effect/Schema";

export class SwarmServiceUpdateResponse extends Schema.Class<SwarmServiceUpdateResponse>("SwarmServiceUpdateResponse")(
    {
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "SwarmServiceUpdateResponse",
        title: "swarm.ServiceUpdateResponse",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/service_update_response.go#L6-L12",
    }
) {}
