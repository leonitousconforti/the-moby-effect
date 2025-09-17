import * as Schema from "effect/Schema";
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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Service",
    }
) {}
