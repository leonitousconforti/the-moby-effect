import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class VolumeInfo extends Schema.Class<VolumeInfo>("VolumeInfo")(
    {
        CapacityBytes: Schema.optional(MobySchemas.Int64),
        VolumeContext: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        VolumeID: Schema.optional(Schema.String),
        AccessibleTopology: Schema.optional(Schema.Array(MobySchemasGenerated.VolumeTopology), { nullable: true }),
    },
    {
        identifier: "VolumeInfo",
        title: "volume.Info",
    }
) {}
