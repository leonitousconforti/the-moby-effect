import * as Schema from "@effect/schema/Schema";

export class CopyToContainerOptions extends Schema.Class<CopyToContainerOptions>("CopyToContainerOptions")({
    AllowOverwriteDirWithFile: Schema.Boolean,
    CopyUIDGID: Schema.Boolean,
}) {}
