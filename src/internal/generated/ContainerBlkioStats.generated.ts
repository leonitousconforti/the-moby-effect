import * as Schema from "effect/Schema";
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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#BlkioStats",
    }
) {}
