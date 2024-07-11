import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Location extends Schema.Class<Location>("Location")({
    name: Schema.String,
    zone: Schema.Array(MobySchemas.zone),
    tx: Schema.Array(MobySchemas.zoneTrans),
    extend: Schema.String,
    cacheStart: MobySchemas.Int64,
    cacheEnd: MobySchemas.Int64,
    cacheZone: MobySchemas.zone,
}) {}
