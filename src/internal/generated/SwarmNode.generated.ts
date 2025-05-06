import * as Schema from "effect/Schema";
import * as SwarmManagerStatus from "./SwarmManagerStatus.generated.js";
import * as SwarmMeta from "./SwarmMeta.generated.js";
import * as SwarmNodeDescription from "./SwarmNodeDescription.generated.js";
import * as SwarmNodeSpec from "./SwarmNodeSpec.generated.js";
import * as SwarmNodeStatus from "./SwarmNodeStatus.generated.js";

export class SwarmNode extends Schema.Class<SwarmNode>("SwarmNode")(
    {
        ID: Schema.String,
        ...SwarmMeta.SwarmMeta.fields,
        Spec: Schema.optionalWith(SwarmNodeSpec.SwarmNodeSpec, { nullable: true }),
        Description: Schema.optionalWith(SwarmNodeDescription.SwarmNodeDescription, { nullable: true }),
        Status: Schema.optionalWith(SwarmNodeStatus.SwarmNodeStatus, { nullable: true }),
        ManagerStatus: Schema.optionalWith(SwarmManagerStatus.SwarmManagerStatus, { nullable: true }),
    },
    {
        identifier: "SwarmNode",
        title: "swarm.Node",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/node.go#L3-L18",
    }
) {}
