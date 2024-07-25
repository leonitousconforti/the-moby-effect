import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmSecret extends Schema.Class<SwarmSecret>("SwarmSecret")(
    {
        ID: Schema.String,
        Version: Schema.optionalWith(MobySchemasGenerated.SwarmVersion, { nullable: true }),
        CreatedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        UpdatedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        Spec: Schema.NullOr(MobySchemasGenerated.SwarmSecretSpec),
    },
    {
        identifier: "SwarmSecret",
        title: "swarm.Secret",
    }
) {}
