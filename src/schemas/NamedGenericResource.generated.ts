import * as Schema from "@effect/schema/Schema";

export class NamedGenericResource extends Schema.Class<NamedGenericResource>("NamedGenericResource")({
    Kind: Schema.String,
    Value: Schema.String,
}) {}
