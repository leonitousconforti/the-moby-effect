import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class zone extends Schema.Class<zone>("zone")(
    {
        name: Schema.NullOr(Schema.String),
        offset: Schema.NullOr(MobySchemas.Int64),
        isDST: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "zone",
        title: "time.zone",
    }
) {}
