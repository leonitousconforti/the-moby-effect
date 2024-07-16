import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmPrivileges extends Schema.Class<SwarmPrivileges>("SwarmPrivileges")(
    {
        CredentialSpec: Schema.NullOr(MobySchemasGenerated.SwarmCredentialSpec),
        SELinuxContext: Schema.NullOr(MobySchemasGenerated.SwarmSELinuxContext),
    },
    {
        identifier: "SwarmPrivileges",
        title: "swarm.Privileges",
    }
) {}
