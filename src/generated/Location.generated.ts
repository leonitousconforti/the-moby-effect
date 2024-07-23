import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class Location extends Schema.Class<Location>("Location")(
    {
        name: Schema.String,
        zone: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.zone))),
        tx: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.zoneTrans))),
        extend: Schema.String,
        cacheStart: MobySchemas.Int64,
        cacheEnd: MobySchemas.Int64,
        cacheZone: Schema.NullOr(MobySchemasGenerated.zone),
    },
    {
        identifier: "Location",
        title: "time.Location",
    }
) {}
