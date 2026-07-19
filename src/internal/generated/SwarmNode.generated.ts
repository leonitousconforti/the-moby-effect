import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";
import * as SwarmManagerStatus from "./SwarmManagerStatus.generated.ts";
import * as SwarmMeta from "./SwarmMeta.generated.ts";
import * as SwarmNodeDescription from "./SwarmNodeDescription.generated.ts";
import * as SwarmNodeSpec from "./SwarmNodeSpec.generated.ts";
import * as SwarmNodeStatus from "./SwarmNodeStatus.generated.ts";

export class SwarmNode extends Schema.Class<SwarmNode>("SwarmNode")(
    {
        ID: MobyIdentifiers.NodeIdentifier,
        ...SwarmMeta.SwarmMeta.fields,
        Spec: Schema.optional(Schema.NullOr(SwarmNodeSpec.SwarmNodeSpec)),
        Description: Schema.optional(Schema.NullOr(SwarmNodeDescription.SwarmNodeDescription)),
        Status: Schema.optional(Schema.NullOr(SwarmNodeStatus.SwarmNodeStatus)),
        ManagerStatus: Schema.optional(Schema.NullOr(SwarmManagerStatus.SwarmManagerStatus)),
    },
    {
        identifier: "SwarmNode",
        title: "swarm.Node",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Node",
    }
) {}
