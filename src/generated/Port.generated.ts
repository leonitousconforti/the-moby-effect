import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class Port extends Schema.Class<Port>("Port")(
    {
        IP: Schema.optional(Schema.String, { nullable: true }),
        PrivatePort: Schema.NullOr(MobySchemas.UInt16),
        PublicPort: Schema.optional(MobySchemas.UInt16, { nullable: true }),
        Type: Schema.NullOr(Schema.String),
    },
    {
        identifier: "Port",
        title: "types.Port",
    }
) {}
