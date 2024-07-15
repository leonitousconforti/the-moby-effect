import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class WaitResponse extends Schema.Class<WaitResponse>("WaitResponse")(
    {
        Error: Schema.optional(MobySchemasGenerated.WaitExitError, { nullable: true }),
        StatusCode: Schema.NullOr(MobySchemas.Int64),
    },
    {
        identifier: "WaitResponse",
        title: "container.WaitResponse",
    }
) {}
