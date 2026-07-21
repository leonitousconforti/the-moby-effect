import * as Schema from "effect/Schema";

import * as SwarmEngineDescription from "./SwarmEngineDescription.generated.ts";
import * as SwarmNodeCSIInfo from "./SwarmNodeCSIInfo.generated.ts";
import * as SwarmPlatform from "./SwarmPlatform.generated.ts";
import * as SwarmResources from "./SwarmResources.generated.ts";
import * as SwarmTLSInfo from "./SwarmTLSInfo.generated.ts";

export class SwarmNodeDescription extends Schema.Class<SwarmNodeDescription>("SwarmNodeDescription")(
    {
        Hostname: Schema.optional(Schema.String),
        Platform: Schema.optional(Schema.NullOr(SwarmPlatform.SwarmPlatform)),
        Resources: Schema.optional(Schema.NullOr(SwarmResources.SwarmResources)),
        Engine: Schema.optional(Schema.NullOr(SwarmEngineDescription.SwarmEngineDescription)),
        TLSInfo: Schema.optional(Schema.NullOr(SwarmTLSInfo.SwarmTLSInfo)),
        CSIInfo: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(SwarmNodeCSIInfo.SwarmNodeCSIInfo)))),
    },
    {
        identifier: "SwarmNodeDescription",
        title: "swarm.NodeDescription",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#NodeDescription",
    }
) {}
