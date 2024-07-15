import * as Schema from "@effect/schema/Schema";

export class GlobalService extends Schema.Class<GlobalService>("GlobalService")(
    {},
    {
        identifier: "GlobalService",
        title: "swarm.GlobalService",
    }
) {}
