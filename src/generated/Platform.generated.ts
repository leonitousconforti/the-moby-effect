import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class Platform extends Schema.Class<Platform>("Platform")(
    {
        Architecture: Schema.String,
        OS: Schema.String,
        OSVersion: Schema.String,
        OSFeatures: Schema.Array(Schema.String),
        Variant: Schema.String,
    },
    {
        identifier: "Platform",
        title: "v1.Platform",
    }
) {}
