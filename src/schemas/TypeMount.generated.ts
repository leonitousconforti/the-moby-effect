import * as Schema from "@effect/schema/Schema";

export class TypeMount extends Schema.Class<TypeMount>("TypeMount")({
    FsType: Schema.String,
    MountFlags: Schema.Array(Schema.String),
}) {}
