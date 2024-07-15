import * as Schema from "@effect/schema/Schema";

export class GraphDriverData extends Schema.Class<GraphDriverData>("GraphDriverData")(
    {
        Data: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Name: Schema.NullOr(Schema.String),
    },
    {
        identifier: "GraphDriverData",
        title: "types.GraphDriverData",
    }
) {}
