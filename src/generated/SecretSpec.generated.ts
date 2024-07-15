import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SecretSpec extends Schema.Class<SecretSpec>("SecretSpec")(
    {
        Name: Schema.optional(Schema.String, { nullable: true }),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Data: Schema.optional(Schema.Array(MobySchemas.UInt8), { nullable: true }),
        Driver: Schema.optional(MobySchemasGenerated.Driver, { nullable: true }),
        Templating: Schema.optional(MobySchemasGenerated.Driver, { nullable: true }),
    },
    {
        identifier: "SecretSpec",
        title: "swarm.SecretSpec",
    }
) {}
