import * as Schema from "effect/Schema";
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
        title: "container.Port",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/port.go#L6-L23",
    }
) {}
