import * as Schema from "@effect/schema/Schema";
import * as Time from "./Time.generated.js";

export class SwarmUpdateStatus extends Schema.Class<SwarmUpdateStatus>("SwarmUpdateStatus")(
    {
        State: Schema.optional(Schema.String),
        StartedAt: Schema.optionalWith(Time.Time, { nullable: true }),
        CompletedAt: Schema.optionalWith(Time.Time, { nullable: true }),
        Message: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmUpdateStatus",
        title: "swarm.UpdateStatus",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/service.go#L70-L76",
    }
) {}
