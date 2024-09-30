import * as Schema from "@effect/schema/Schema";
import * as ContainerBlkioStatEntry from "./ContainerBlkioStatEntry.generated.js";

export class ContainerBlkioStats extends Schema.Class<ContainerBlkioStats>("ContainerBlkioStats")(
    {
        io_service_bytes_recursive: Schema.NullOr(
            Schema.Array(Schema.NullOr(ContainerBlkioStatEntry.ContainerBlkioStatEntry))
        ),
        io_serviced_recursive: Schema.NullOr(
            Schema.Array(Schema.NullOr(ContainerBlkioStatEntry.ContainerBlkioStatEntry))
        ),
        io_queue_recursive: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerBlkioStatEntry.ContainerBlkioStatEntry))),
        io_service_time_recursive: Schema.NullOr(
            Schema.Array(Schema.NullOr(ContainerBlkioStatEntry.ContainerBlkioStatEntry))
        ),
        io_wait_time_recursive: Schema.NullOr(
            Schema.Array(Schema.NullOr(ContainerBlkioStatEntry.ContainerBlkioStatEntry))
        ),
        io_merged_recursive: Schema.NullOr(
            Schema.Array(Schema.NullOr(ContainerBlkioStatEntry.ContainerBlkioStatEntry))
        ),
        io_time_recursive: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerBlkioStatEntry.ContainerBlkioStatEntry))),
        sectors_recursive: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerBlkioStatEntry.ContainerBlkioStatEntry))),
    },
    {
        identifier: "ContainerBlkioStats",
        title: "container.BlkioStats",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/stats.go#L91-L105",
    }
) {}
