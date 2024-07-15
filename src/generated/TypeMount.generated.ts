import * as Schema from "@effect/schema/Schema";

export class TypeMount extends Schema.Class<TypeMount>("TypeMount")(
    {
        FsType: Schema.optional(Schema.String, { nullable: true }),
        MountFlags: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "TypeMount",
        title: "volume.TypeMount",
    }
) {}
