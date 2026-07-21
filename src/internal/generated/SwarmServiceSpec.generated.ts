import * as Schema from "effect/Schema";

import * as SwarmAnnotations from "./SwarmAnnotations.generated.ts";
import * as SwarmEndpointSpec from "./SwarmEndpointSpec.generated.ts";
import * as SwarmNetworkAttachmentConfig from "./SwarmNetworkAttachmentConfig.generated.ts";
import * as SwarmServiceMode from "./SwarmServiceMode.generated.ts";
import * as SwarmTaskSpec from "./SwarmTaskSpec.generated.ts";
import * as SwarmUpdateConfig from "./SwarmUpdateConfig.generated.ts";

export class SwarmServiceSpec extends Schema.Class<SwarmServiceSpec>("SwarmServiceSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        TaskTemplate: Schema.optional(Schema.NullOr(SwarmTaskSpec.SwarmTaskSpec)),
        Mode: Schema.optional(Schema.NullOr(SwarmServiceMode.SwarmServiceMode)),
        UpdateConfig: Schema.optional(Schema.NullOr(SwarmUpdateConfig.SwarmUpdateConfig)),
        RollbackConfig: Schema.optional(Schema.NullOr(SwarmUpdateConfig.SwarmUpdateConfig)),
        Networks: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.NullOr(SwarmNetworkAttachmentConfig.SwarmNetworkAttachmentConfig)))
        ),
        EndpointSpec: Schema.optional(Schema.NullOr(SwarmEndpointSpec.SwarmEndpointSpec)),
    },
    {
        identifier: "SwarmServiceSpec",
        title: "swarm.ServiceSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ServiceSpec",
    }
) {}
