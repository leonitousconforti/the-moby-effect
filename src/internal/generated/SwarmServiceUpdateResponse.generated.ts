import * as Schema from "effect/Schema";

export class SwarmServiceUpdateResponse extends Schema.Class<SwarmServiceUpdateResponse>("SwarmServiceUpdateResponse")(
    {
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "SwarmServiceUpdateResponse",
        title: "swarm.ServiceUpdateResponse",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/service_update_response.go#L6-L12",
    }
) {}
