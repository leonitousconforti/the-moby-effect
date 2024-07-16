import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class BlkioStats extends Schema.Class<BlkioStats>("BlkioStats")(
    {
        io_service_bytes_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.BlkioStatEntry)),
        io_serviced_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.BlkioStatEntry)),
        io_queue_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.BlkioStatEntry)),
        io_service_time_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.BlkioStatEntry)),
        io_wait_time_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.BlkioStatEntry)),
        io_merged_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.BlkioStatEntry)),
        io_time_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.BlkioStatEntry)),
        sectors_recursive: Schema.NullOr(Schema.Array(MobySchemasGenerated.BlkioStatEntry)),
    },
    {
        identifier: "BlkioStats",
        title: "types.BlkioStats",
    }
) {}
