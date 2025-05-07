import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as HealthcheckResult from "./HealthcheckResult.generated.js";

/** https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/health.go#L5-L16 */
export enum HealthStatus {
    NO_HEALTH_CHECK = "none",
    STARTING = "starting",
    HEALTHY = "healthy",
    UNHEALTHY = "unhealthy",
}

export class Health extends Schema.Class<Health>("Health")(
    {
        Status: Schema.Enums(HealthStatus),
        FailingStreak: MobySchemas.Int64,
        Log: Schema.NullOr(Schema.Array(Schema.NullOr(HealthcheckResult.HealthcheckResult))),
    },
    {
        identifier: "Health",
        title: "container.Health",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/health.go#L18-L23",
    }
) {}
