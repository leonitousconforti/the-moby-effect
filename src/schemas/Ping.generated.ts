import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Ping extends Schema.Class<Ping>("Ping")({
    APIVersion: Schema.String,
    OSType: Schema.String,
    Experimental: Schema.Boolean,
    BuilderVersion: Schema.String,
    SwarmStatus: MobySchemas.Status,
}) {}
