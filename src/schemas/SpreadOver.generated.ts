import * as Schema from "@effect/schema/Schema";

export class SpreadOver extends Schema.Class<SpreadOver>("SpreadOver")({
    SpreadDescriptor: Schema.String,
}) {}
