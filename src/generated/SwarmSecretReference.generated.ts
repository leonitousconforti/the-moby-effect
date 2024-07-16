import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmSecretReference extends Schema.Class<SwarmSecretReference>("SwarmSecretReference")(
    {
        File: Schema.NullOr(MobySchemasGenerated.SwarmSecretReferenceFileTarget),
        SecretID: Schema.String,
        SecretName: Schema.String,
    },
    {
        identifier: "SwarmSecretReference",
        title: "swarm.SecretReference",
    }
) {}
