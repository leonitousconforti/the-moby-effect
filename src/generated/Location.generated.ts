import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class Location extends Schema.Class<Location>("Location")(
    {
        name: Schema.String,
        zone: Schema.NullOr(Schema.Array(MobySchemasGenerated.zone)),
        tx: Schema.NullOr(Schema.Array(MobySchemasGenerated.zoneTrans)),
        extend: Schema.String,
        cacheStart: MobySchemas.Int64,
        cacheEnd: MobySchemas.Int64,
        cacheZone: Schema.NullOr(MobySchemasGenerated.zone),
    },
    {
        identifier: "Location",
        title: "time.Location",
        documentation:
            "https://github.com/golang/go/blob/3959d54c0bd5c92fe0a5e33fedb0595723efc23b/src/time/zoneinfo.go#L15-L47",
    }
) {}
