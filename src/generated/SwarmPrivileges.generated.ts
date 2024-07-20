import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmPrivileges extends Schema.Class<SwarmPrivileges>("SwarmPrivileges")(
    {
        CredentialSpec: Schema.NullOr(MobySchemasGenerated.SwarmCredentialSpec),
        SELinuxContext: Schema.NullOr(MobySchemasGenerated.SwarmSELinuxContext),
        Seccomp: Schema.optional(MobySchemasGenerated.SwarmSeccompOpts, { nullable: true }),
        AppArmor: Schema.optional(MobySchemasGenerated.SwarmAppArmorOpts, { nullable: true }),
        NoNewPrivileges: Schema.Boolean,
    },
    {
        identifier: "SwarmPrivileges",
        title: "swarm.Privileges",
    }
) {}
