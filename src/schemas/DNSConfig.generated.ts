import * as Schema from "@effect/schema/Schema";

export class DNSConfig extends Schema.Class<DNSConfig>("DNSConfig")({
    Nameservers: Schema.Array(Schema.String),
    Search: Schema.Array(Schema.String),
    Options: Schema.Array(Schema.String),
}) {}
