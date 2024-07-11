import * as Schema from "@effect/schema/Schema";

export class IPAMConfig extends Schema.Class<IPAMConfig>("IPAMConfig")({
    Subnet: Schema.String,
    Range: Schema.String,
    Gateway: Schema.String,
}) {}
