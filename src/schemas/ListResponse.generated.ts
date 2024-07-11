import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ListResponse extends Schema.Class<ListResponse>("ListResponse")({
    Volumes: Schema.Array(MobySchemas.Volume),
    Warnings: Schema.Array(Schema.String),
}) {}
