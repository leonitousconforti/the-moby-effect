import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class Location extends Schema.Class<Location>("Location")(
    {
        name: Schema.NullOr(Schema.String),
        zone: Schema.NullOr(Schema.Array(MobySchemasGenerated.zone)),
        tx: Schema.NullOr(Schema.Array(MobySchemasGenerated.zoneTrans)),
        extend: Schema.NullOr(Schema.String),
        cacheStart: Schema.NullOr(MobySchemas.Int64),
        cacheEnd: Schema.NullOr(MobySchemas.Int64),
        cacheZone: Schema.NullOr(MobySchemasGenerated.zone),
    },
    {
        identifier: "Location",
        title: "time.Location",
    }
) {}
