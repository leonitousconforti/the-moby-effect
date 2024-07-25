import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as Zone from "./zone.generated.js";
import * as ZoneTrans from "./zoneTrans.generated.js";

export class Location extends Schema.Class<Location>("Location")(
    {
        name: Schema.String,
        zone: Schema.NullOr(Schema.Array(Schema.NullOr(Zone.zone))),
        tx: Schema.NullOr(Schema.Array(Schema.NullOr(ZoneTrans.zoneTrans))),
        extend: Schema.String,
        cacheStart: MobySchemas.Int64,
        cacheEnd: MobySchemas.Int64,
        cacheZone: Schema.NullOr(Zone.zone),
    },
    {
        identifier: "Location",
        title: "time.Location",
        documentation:
            "https://github.com/golang/go/blob/e76353d5a923dbc5e22713267104b56a2c856302/src/time/zoneinfo.go#L15-L47",
    }
) {}
