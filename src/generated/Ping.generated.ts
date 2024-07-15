import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class Ping extends Schema.Class<Ping>("Ping")(
    {
        APIVersion: Schema.NullOr(Schema.String),
        OSType: Schema.NullOr(Schema.String),
        Experimental: Schema.NullOr(Schema.Boolean),
        BuilderVersion: Schema.NullOr(Schema.String),
        SwarmStatus: Schema.NullOr(MobySchemasGenerated.Status),
    },
    {
        identifier: "Ping",
        title: "types.Ping",
    }
) {}
