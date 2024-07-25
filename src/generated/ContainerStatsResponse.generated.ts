import * as Schema from "@effect/schema/Schema";
import * as ContainerNetworkStats from "./ContainerNetworkStats.generated.js";
import * as ContainerStats from "./ContainerStats.generated.js";

export class ContainerStatsResponse extends Schema.Class<ContainerStatsResponse>("ContainerStatsResponse")(
    {
        ...ContainerStats.ContainerStats.fields,
        name: Schema.optional(Schema.String),
        id: Schema.optional(Schema.String),
        networks: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.NullOr(ContainerNetworkStats.ContainerNetworkStats),
            }),
            { nullable: true }
        ),
    },
    {
        identifier: "ContainerStatsResponse",
        title: "container.StatsResponse",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/stats.go#L170-L181",
    }
) {}
