import * as Schema from "@effect/schema/Schema";

export class ConfigReference extends Schema.Class<ConfigReference>("ConfigReference")({
    Network: Schema.String,
}) {}
