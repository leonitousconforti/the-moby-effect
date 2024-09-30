import * as Schema from "@effect/schema/Schema";

export class GraphDriverData extends Schema.Class<GraphDriverData>("GraphDriverData")(
    {
        Data: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
        Name: Schema.String,
    },
    {
        identifier: "GraphDriverData",
        title: "types.GraphDriverData",
        documentation:
            "https://github.com/moby/moby/blob/733755d7cb18a4dbea7c290cc56e61d05502aca0/api/types/storage/driver_data.go#L3-L23",
    }
) {}
