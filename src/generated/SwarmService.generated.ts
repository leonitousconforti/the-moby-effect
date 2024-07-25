import * as Schema from "@effect/schema/Schema";
import * as SwarmEndpoint from "./SwarmEndpoint.generated.js";
import * as SwarmJobStatus from "./SwarmJobStatus.generated.js";
import * as SwarmMeta from "./SwarmMeta.generated.js";
import * as SwarmServiceSpec from "./SwarmServiceSpec.generated.js";
import * as SwarmServiceStatus from "./SwarmServiceStatus.generated.js";
import * as SwarmUpdateStatus from "./SwarmUpdateStatus.generated.js";

export class SwarmService extends Schema.Class<SwarmService>("SwarmService")(
    {
        ID: Schema.String,
        ...SwarmMeta.SwarmMeta.fields,
        Spec: Schema.optionalWith(SwarmServiceSpec.SwarmServiceSpec, { nullable: true }),
        PreviousSpec: Schema.optionalWith(SwarmServiceSpec.SwarmServiceSpec, { nullable: true }),
        Endpoint: Schema.optionalWith(SwarmEndpoint.SwarmEndpoint, { nullable: true }),
        UpdateStatus: Schema.optionalWith(SwarmUpdateStatus.SwarmUpdateStatus, { nullable: true }),
        ServiceStatus: Schema.optionalWith(SwarmServiceStatus.SwarmServiceStatus, { nullable: true }),
        JobStatus: Schema.optionalWith(SwarmJobStatus.SwarmJobStatus, { nullable: true }),
    },
    {
        identifier: "SwarmService",
        title: "swarm.Service",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/service.go#L5-L24",
    }
) {}
