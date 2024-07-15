import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class Address extends Schema.Class<Address>("Address")(
    {
        Addr: Schema.NullOr(Schema.String),
        PrefixLen: Schema.NullOr(MobySchemas.Int64),
    },
    {
        identifier: "Address",
        title: "network.Address",
    }
) {}
