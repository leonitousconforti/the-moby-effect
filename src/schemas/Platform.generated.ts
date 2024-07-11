import * as Schema from "@effect/schema/Schema";

export class Platform extends Schema.Class<Platform>("Platform")({
    Architecture: Schema.String,
    OS: Schema.String,
}) {}
