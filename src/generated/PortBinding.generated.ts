import * as Schema from "@effect/schema/Schema";

export class PortBinding extends Schema.Class<PortBinding>("PortBinding")(
    {
        HostIp: Schema.String,
        HostPort: Schema.String,
    },
    {
        identifier: "PortBinding",
        title: "nat.PortBinding",
    }
) {}
