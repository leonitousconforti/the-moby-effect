import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ListResponse extends Schema.Class<ListResponse>("ListResponse")(
    {
        Volumes: Schema.NullOr(Schema.Array(MobySchemasGenerated.Volume)),
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ListResponse",
        title: "volume.ListResponse",
    }
) {}
