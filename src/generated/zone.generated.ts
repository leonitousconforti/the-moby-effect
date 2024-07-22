import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class zone extends Schema.Class<zone>("zone")(
    {
        name: Schema.String,
        offset: MobySchemas.Int64,
        isDST: Schema.Boolean,
    },
    {
        identifier: "zone",
        title: "time.zone",
        documentation:
            "https://github.com/golang/go/blob/3959d54c0bd5c92fe0a5e33fedb0595723efc23b/src/time/zoneinfo.go#L49-L54",
    }
) {}
