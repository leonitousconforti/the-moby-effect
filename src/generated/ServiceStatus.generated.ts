import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ServiceStatus extends Schema.Class<ServiceStatus>("ServiceStatus")(
    {
        RunningTasks: Schema.NullOr(MobySchemas.UInt64),
        DesiredTasks: Schema.NullOr(MobySchemas.UInt64),
        CompletedTasks: Schema.NullOr(MobySchemas.UInt64),
    },
    {
        identifier: "ServiceStatus",
        title: "swarm.ServiceStatus",
    }
) {}
