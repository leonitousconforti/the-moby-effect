import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class Port extends Schema.Class<Port>("Port")(
    {
        IP: Schema.optional(MobySchemas.Address),
        PrivatePort: MobySchemas.Port,
        PublicPort: Schema.optional(MobySchemas.Port),
        Type: Schema.String,
    },
    {
        identifier: "Port",
        title: "types.Port",
        documentation:
            "https://github.com/moby/moby/blob/733755d7cb18a4dbea7c290cc56e61d05502aca0/api/types/container/port.go#L6-L23",
    }
) {}
