import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";
import * as SwarmEndpoint from "./SwarmEndpoint.generated.ts";
import * as SwarmJobStatus from "./SwarmJobStatus.generated.ts";
import * as SwarmMeta from "./SwarmMeta.generated.ts";
import * as SwarmServiceSpec from "./SwarmServiceSpec.generated.ts";
import * as SwarmServiceStatus from "./SwarmServiceStatus.generated.ts";
import * as SwarmUpdateStatus from "./SwarmUpdateStatus.generated.ts";

export class SwarmService extends Schema.Class<SwarmService>("SwarmService")(
    {
        ID: MobyIdentifiers.ServiceIdentifier,
        ...SwarmMeta.SwarmMeta.fields,
        Spec: Schema.optional(Schema.NullOr(SwarmServiceSpec.SwarmServiceSpec)),
        PreviousSpec: Schema.optional(Schema.NullOr(SwarmServiceSpec.SwarmServiceSpec)),
        Endpoint: Schema.optional(Schema.NullOr(SwarmEndpoint.SwarmEndpoint)),
        UpdateStatus: Schema.optional(Schema.NullOr(SwarmUpdateStatus.SwarmUpdateStatus)),
        ServiceStatus: Schema.optional(Schema.NullOr(SwarmServiceStatus.SwarmServiceStatus)),
        JobStatus: Schema.optional(Schema.NullOr(SwarmJobStatus.SwarmJobStatus)),
    },
    {
        identifier: "SwarmService",
        title: "swarm.Service",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Service",
    }
) {}
