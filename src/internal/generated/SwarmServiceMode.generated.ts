import * as Schema from "effect/Schema";
import * as SwarmGlobalJob from "./SwarmGlobalJob.generated.ts";
import * as SwarmGlobalService from "./SwarmGlobalService.generated.ts";
import * as SwarmReplicatedJob from "./SwarmReplicatedJob.generated.ts";
import * as SwarmReplicatedService from "./SwarmReplicatedService.generated.ts";

export class SwarmServiceMode extends Schema.Class<SwarmServiceMode>("SwarmServiceMode")(
    {
        Replicated: Schema.optional(Schema.NullOr(SwarmReplicatedService.SwarmReplicatedService)),
        Global: Schema.optional(Schema.NullOr(SwarmGlobalService.SwarmGlobalService)),
        ReplicatedJob: Schema.optional(Schema.NullOr(SwarmReplicatedJob.SwarmReplicatedJob)),
        GlobalJob: Schema.optional(Schema.NullOr(SwarmGlobalJob.SwarmGlobalJob)),
    },
    {
        identifier: "SwarmServiceMode",
        title: "swarm.ServiceMode",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ServiceMode",
    }
) {}
