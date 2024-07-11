import * as Schema from "@effect/schema/Schema";

export class Checkpoint extends Schema.Class<Checkpoint>("Checkpoint")({
    Name: Schema.String,
}) {}
