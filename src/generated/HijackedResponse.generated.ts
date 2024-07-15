import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class HijackedResponse extends Schema.Class<HijackedResponse>("HijackedResponse")(
    {
        mediaType: Schema.NullOr(Schema.String),
        Conn: Schema.Object,
        Reader: Schema.NullOr(MobySchemasGenerated.Reader),
    },
    {
        identifier: "HijackedResponse",
        title: "types.HijackedResponse",
    }
) {}
