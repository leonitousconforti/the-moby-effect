import * as Schema from "@effect/schema/Schema";

export class PortBinding extends Schema.Class<PortBinding>("PortBinding")(
    {
        HostIp: Schema.NullOr(Schema.String),
        HostPort: Schema.NullOr(Schema.String),
    },
    {
        identifier: "PortBinding",
        title: "nat.PortBinding",
    }
) {}
