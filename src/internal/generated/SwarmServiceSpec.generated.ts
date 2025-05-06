import * as Schema from "effect/Schema";
import * as SwarmAnnotations from "./SwarmAnnotations.generated.js";
import * as SwarmEndpointSpec from "./SwarmEndpointSpec.generated.js";
import * as SwarmNetworkAttachmentConfig from "./SwarmNetworkAttachmentConfig.generated.js";
import * as SwarmServiceMode from "./SwarmServiceMode.generated.js";
import * as SwarmTaskSpec from "./SwarmTaskSpec.generated.js";
import * as SwarmUpdateConfig from "./SwarmUpdateConfig.generated.js";

export class SwarmServiceSpec extends Schema.Class<SwarmServiceSpec>("SwarmServiceSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        TaskTemplate: Schema.optionalWith(SwarmTaskSpec.SwarmTaskSpec, { nullable: true }),
        Mode: Schema.optionalWith(SwarmServiceMode.SwarmServiceMode, { nullable: true }),
        UpdateConfig: Schema.optionalWith(SwarmUpdateConfig.SwarmUpdateConfig, { nullable: true }),
        RollbackConfig: Schema.optionalWith(SwarmUpdateConfig.SwarmUpdateConfig, { nullable: true }),
        Networks: Schema.optionalWith(
            Schema.Array(Schema.NullOr(SwarmNetworkAttachmentConfig.SwarmNetworkAttachmentConfig)),
            { nullable: true }
        ),
        EndpointSpec: Schema.optionalWith(SwarmEndpointSpec.SwarmEndpointSpec, { nullable: true }),
    },
    {
        identifier: "SwarmServiceSpec",
        title: "swarm.ServiceSpec",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/service.go#L26-L42",
    }
) {}
