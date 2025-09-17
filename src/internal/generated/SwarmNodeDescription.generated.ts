import * as Schema from "effect/Schema";
import * as SwarmEngineDescription from "./SwarmEngineDescription.generated.js";
import * as SwarmNodeCSIInfo from "./SwarmNodeCSIInfo.generated.js";
import * as SwarmPlatform from "./SwarmPlatform.generated.js";
import * as SwarmResources from "./SwarmResources.generated.js";
import * as SwarmTLSInfo from "./SwarmTLSInfo.generated.js";

export class SwarmNodeDescription extends Schema.Class<SwarmNodeDescription>("SwarmNodeDescription")(
    {
        Hostname: Schema.optional(Schema.String),
        Platform: Schema.optionalWith(SwarmPlatform.SwarmPlatform, { nullable: true }),
        Resources: Schema.optionalWith(SwarmResources.SwarmResources, { nullable: true }),
        Engine: Schema.optionalWith(SwarmEngineDescription.SwarmEngineDescription, { nullable: true }),
        TLSInfo: Schema.optionalWith(SwarmTLSInfo.SwarmTLSInfo, { nullable: true }),
        CSIInfo: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmNodeCSIInfo.SwarmNodeCSIInfo)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmNodeDescription",
        title: "swarm.NodeDescription",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#NodeDescription",
    }
) {}
