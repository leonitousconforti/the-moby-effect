import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmPrivileges extends Schema.Class<SwarmPrivileges>("SwarmPrivileges")(
    {
        CredentialSpec: Schema.NullOr(MobySchemasGenerated.SwarmCredentialSpec),
        SELinuxContext: Schema.NullOr(MobySchemasGenerated.SwarmSELinuxContext),
        Seccomp: Schema.optionalWith(MobySchemasGenerated.SwarmSeccompOpts, { nullable: true }),
        AppArmor: Schema.optionalWith(MobySchemasGenerated.SwarmAppArmorOpts, { nullable: true }),
        NoNewPrivileges: Schema.Boolean,
    },
    {
        identifier: "SwarmPrivileges",
        title: "swarm.Privileges",
    }
) {}
