import * as Schema from "@effect/schema/Schema";

export class SwarmGlobalJob extends Schema.Class<SwarmGlobalJob>("SwarmGlobalJob")(
    {},
    {
        identifier: "SwarmGlobalJob",
        title: "swarm.GlobalJob",
    }
) {}
