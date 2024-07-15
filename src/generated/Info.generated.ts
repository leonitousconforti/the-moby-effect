import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class Info extends Schema.Class<Info>("Info")(
    {
        CapacityBytes: Schema.optional(MobySchemas.Int64, { nullable: true }),
        VolumeContext: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        VolumeID: Schema.optional(Schema.String, { nullable: true }),
        AccessibleTopology: Schema.optional(Schema.Array(MobySchemasGenerated.Topology), { nullable: true }),
    },
    {
        identifier: "Info",
        title: "volume.Info",
    }
) {}
