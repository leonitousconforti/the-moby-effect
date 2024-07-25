import * as Schema from "@effect/schema/Schema";
import * as SwarmAppArmorOpts from "./SwarmAppArmorOpts.generated.js";
import * as SwarmCredentialSpec from "./SwarmCredentialSpec.generated.js";
import * as SwarmSELinuxContext from "./SwarmSELinuxContext.generated.js";
import * as SwarmSeccompOpts from "./SwarmSeccompOpts.generated.js";

export class SwarmPrivileges extends Schema.Class<SwarmPrivileges>("SwarmPrivileges")(
    {
        CredentialSpec: Schema.NullOr(SwarmCredentialSpec.SwarmCredentialSpec),
        SELinuxContext: Schema.NullOr(SwarmSELinuxContext.SwarmSELinuxContext),
        Seccomp: Schema.optionalWith(SwarmSeccompOpts.SwarmSeccompOpts, { nullable: true }),
        AppArmor: Schema.optionalWith(SwarmAppArmorOpts.SwarmAppArmorOpts, { nullable: true }),
        NoNewPrivileges: Schema.Boolean,
    },
    {
        identifier: "SwarmPrivileges",
        title: "swarm.Privileges",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/container.go#L77-L84",
    }
) {}
