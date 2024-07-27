import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as Location from "./Location.generated.js";

export class Time extends Schema.Class<Time>("Time")(
    {
        wall: MobySchemas.UInt64,
        ext: MobySchemas.Int64,
        loc: Schema.NullOr(Location.Location),
    },
    {
        identifier: "Time",
        title: "time.Time",
        documentation:
            "https://github.com/golang/go/blob/3959d54c0bd5c92fe0a5e33fedb0595723efc23b/src/time/time.go#L98-L160",
    }
) {}
