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
            )
        ),
        StartedAt: Schema.optionalWith(Schema.DateFromString, { nullable: true }),
        CompletedAt: Schema.optionalWith(Schema.DateFromString, { nullable: true }),
        Message: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmUpdateStatus",
        title: "swarm.UpdateStatus",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#UpdateStatus",
    }
) {}
