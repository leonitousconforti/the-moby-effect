import * as Schema from "@effect/schema/Schema";

export class GlobalJob extends Schema.Class<GlobalJob>("GlobalJob")(
    {},
    {
        identifier: "GlobalJob",
        title: "swarm.GlobalJob",
    }
) {}
