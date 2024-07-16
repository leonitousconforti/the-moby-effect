import * as Schema from "@effect/schema/Schema";

export class SwarmSpreadOver extends Schema.Class<SwarmSpreadOver>("SwarmSpreadOver")(
    {
        SpreadDescriptor: Schema.String,
    },
    {
        identifier: "SwarmSpreadOver",
        title: "swarm.SpreadOver",
    }
) {}
