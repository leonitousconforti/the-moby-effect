import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class AccessMode extends Schema.Class<AccessMode>("AccessMode")(
    {
        Scope: Schema.optional(Schema.String, { nullable: true }),
        Sharing: Schema.optional(Schema.String, { nullable: true }),
        MountVolume: Schema.optional(MobySchemasGenerated.TypeMount, { nullable: true }),
        BlockVolume: Schema.optional(MobySchemasGenerated.TypeBlock, { nullable: true }),
    },
    {
        identifier: "AccessMode",
        title: "volume.AccessMode",
    }
) {}
