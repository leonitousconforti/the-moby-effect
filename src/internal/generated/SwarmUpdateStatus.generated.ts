import * as Schema from "effect/Schema";

export class SwarmUpdateStatus extends Schema.Class<SwarmUpdateStatus>("SwarmUpdateStatus")(
    {
        State: Schema.optional(
            Schema.Literal(
                "updating",
                "paused",
                "completed",
                "rollback_started",
                "rollback_paused",
                "rollback_completed"
            ).annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/service.go#L52-L68",
            })
        ),
        StartedAt: Schema.optionalWith(Schema.DateFromString, { nullable: true }),
        CompletedAt: Schema.optionalWith(Schema.DateFromString, { nullable: true }),
        Message: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmUpdateStatus",
        title: "swarm.UpdateStatus",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/service.go#L70-L76",
    }
) {}
