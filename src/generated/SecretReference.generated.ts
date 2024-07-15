import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SecretReference extends Schema.Class<SecretReference>("SecretReference")(
    {
        File: Schema.NullOr(MobySchemasGenerated.SecretReferenceFileTarget),
        SecretID: Schema.NullOr(Schema.String),
        SecretName: Schema.NullOr(Schema.String),
    },
    {
        identifier: "SecretReference",
        title: "swarm.SecretReference",
    }
) {}
