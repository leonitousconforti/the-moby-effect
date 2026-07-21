import * as Schema from "effect/Schema";

export class SwarmGlobalService extends Schema.Class<SwarmGlobalService>("SwarmGlobalService")(
    {},
    {
        identifier: "SwarmGlobalService",
        title: "swarm.GlobalService",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#GlobalService",
    }
) {}
