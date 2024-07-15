import * as Schema from "@effect/schema/Schema";

export class TypeMount extends Schema.Class<TypeMount>("TypeMount")(
    {
        /** FsType specifies the filesystem type for the mount volume */
        FsType: Schema.optional(Schema.String),

        /** MountFlags defines flags to pass when mounting the volume */
        MountFlags: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "TypeMount",
        title: "volume.TypeMount",
    }
) {}
