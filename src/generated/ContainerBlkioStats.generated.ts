import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ContainerBlkioStats extends Schema.Class<ContainerBlkioStats>("ContainerBlkioStats")(
    {
        io_service_bytes_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.ContainerBlkioStatEntry)),
        io_serviced_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.ContainerBlkioStatEntry)),
        io_queue_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.ContainerBlkioStatEntry)),
        io_service_time_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.ContainerBlkioStatEntry)),
        io_wait_time_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.ContainerBlkioStatEntry)),
        io_merged_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.ContainerBlkioStatEntry)),
        io_time_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.ContainerBlkioStatEntry)),
        sectors_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.ContainerBlkioStatEntry)),
    },
    {
        identifier: "ContainerBlkioStats",
        title: "container.BlkioStats",
    }
) {}
