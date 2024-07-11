import * as Schema from "@effect/schema/Schema";

export class IDResponse extends Schema.Class<IDResponse>("IDResponse")({
    ID: Schema.String,
}) {}
