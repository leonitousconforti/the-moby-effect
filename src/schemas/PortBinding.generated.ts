import * as Schema from "@effect/schema/Schema";

export class PortBinding extends Schema.Class<PortBinding>("PortBinding")({
    HostIP: Schema.String,
    HostPort: Schema.String,
}) {}
