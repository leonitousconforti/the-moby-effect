import * as Schema from "@effect/schema/Schema";

export class BindOptions extends Schema.Class<BindOptions>("BindOptions")({
    Propagation: Schema.String,
    NonRecursive: Schema.Boolean,
    CreateMountpoint: Schema.Boolean,
}) {}
