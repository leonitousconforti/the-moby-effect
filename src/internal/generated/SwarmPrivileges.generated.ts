import * as Schema from "effect/Schema";
import * as SwarmAppArmorOpts from "./SwarmAppArmorOpts.generated.ts";
import * as SwarmCredentialSpec from "./SwarmCredentialSpec.generated.ts";
import * as SwarmSELinuxContext from "./SwarmSELinuxContext.generated.ts";
import * as SwarmSeccompOpts from "./SwarmSeccompOpts.generated.ts";

export class SwarmPrivileges extends Schema.Class<SwarmPrivileges>("SwarmPrivileges")(
    {
        CredentialSpec: Schema.NullOr(SwarmCredentialSpec.SwarmCredentialSpec),
        SELinuxContext: Schema.NullOr(SwarmSELinuxContext.SwarmSELinuxContext),
        Seccomp: Schema.optional(Schema.NullOr(SwarmSeccompOpts.SwarmSeccompOpts)),
        AppArmor: Schema.optional(Schema.NullOr(SwarmAppArmorOpts.SwarmAppArmorOpts)),
        NoNewPrivileges: Schema.Boolean,
    },
    {
        identifier: "SwarmPrivileges",
        title: "swarm.Privileges",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Privileges",
    }
) {}
