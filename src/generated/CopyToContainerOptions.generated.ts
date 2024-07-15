import * as Schema from "@effect/schema/Schema";

export class CopyToContainerOptions extends Schema.Class<CopyToContainerOptions>("CopyToContainerOptions")(
    {
        AllowOverwriteDirWithFile: Schema.NullOr(Schema.Boolean),
        CopyUIDGID: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "CopyToContainerOptions",
        title: "types.CopyToContainerOptions",
    }
) {}
