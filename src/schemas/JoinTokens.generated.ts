import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class JoinTokens extends Schema.Class<JoinTokens>("JoinTokens")({
    Worker: Schema.String,
    Manager: Schema.String,
}) {}
