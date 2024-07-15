import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SecurityOpt extends Schema.Class<SecurityOpt>("SecurityOpt")(
    {
        Name: Schema.NullOr(Schema.String),
        Options: Schema.NullOr(Schema.Array(MobySchemasGenerated.KeyValue)),
    },
    {
        identifier: "SecurityOpt",
        title: "types.SecurityOpt",
    }
) {}
