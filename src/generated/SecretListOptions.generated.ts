import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SecretListOptions extends Schema.Class<SecretListOptions>("SecretListOptions")(
    {
        Filters: MobySchemasGenerated.Args,
    },
    {
        identifier: "SecretListOptions",
        title: "types.SecretListOptions",
    }
) {}
