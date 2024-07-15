import * as Schema from "@effect/schema/Schema";

export class SpreadOver extends Schema.Class<SpreadOver>("SpreadOver")(
    {
        SpreadDescriptor: Schema.NullOr(Schema.String),
    },
    {
        identifier: "SpreadOver",
        title: "swarm.SpreadOver",
    }
) {}
