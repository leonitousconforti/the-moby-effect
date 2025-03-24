import * as Schema from "effect/Schema";
import * as SwarmGlobalJob from "./SwarmGlobalJob.generated.js";
import * as SwarmGlobalService from "./SwarmGlobalService.generated.js";
import * as SwarmReplicatedJob from "./SwarmReplicatedJob.generated.js";
import * as SwarmReplicatedService from "./SwarmReplicatedService.generated.js";

export class SwarmServiceMode extends Schema.Class<SwarmServiceMode>("SwarmServiceMode")(
    {
        Replicated: Schema.optionalWith(SwarmReplicatedService.SwarmReplicatedService, { nullable: true }),
        Global: Schema.optionalWith(SwarmGlobalService.SwarmGlobalService, { nullable: true }),
        ReplicatedJob: Schema.optionalWith(SwarmReplicatedJob.SwarmReplicatedJob, { nullable: true }),
        GlobalJob: Schema.optionalWith(SwarmGlobalJob.SwarmGlobalJob, { nullable: true }),
    },
    {
        identifier: "SwarmServiceMode",
        title: "swarm.ServiceMode",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/service.go#L44-L50",
    }
) {}
