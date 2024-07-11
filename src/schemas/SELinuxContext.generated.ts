import * as Schema from "@effect/schema/Schema";

export class SELinuxContext extends Schema.Class<SELinuxContext>("SELinuxContext")({
    Disable: Schema.Boolean,
    User: Schema.String,
    Role: Schema.String,
    Type: Schema.String,
    Level: Schema.String,
}) {}
