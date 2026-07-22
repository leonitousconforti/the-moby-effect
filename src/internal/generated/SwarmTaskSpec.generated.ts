import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";
import * as RuntimePluginSpec from "./RuntimePluginSpec.generated.ts";
import * as SwarmContainerSpec from "./SwarmContainerSpec.generated.ts";
import * as SwarmDriver from "./SwarmDriver.generated.ts";
import * as SwarmNetworkAttachmentConfig from "./SwarmNetworkAttachmentConfig.generated.ts";
import * as SwarmNetworkAttachmentSpec from "./SwarmNetworkAttachmentSpec.generated.ts";
import * as SwarmPlacement from "./SwarmPlacement.generated.ts";
import * as SwarmResourceRequirements from "./SwarmResourceRequirements.generated.ts";
import * as SwarmRestartPolicy from "./SwarmRestartPolicy.generated.ts";

export class SwarmTaskSpec extends Schema.Class<SwarmTaskSpec>("SwarmTaskSpec")(
    {
        ContainerSpec: Schema.optional(Schema.NullOr(SwarmContainerSpec.SwarmContainerSpec)),
        PluginSpec: Schema.optional(Schema.NullOr(RuntimePluginSpec.RuntimePluginSpec)),
        NetworkAttachmentSpec: Schema.optional(Schema.NullOr(SwarmNetworkAttachmentSpec.SwarmNetworkAttachmentSpec)),
        Resources: Schema.optional(Schema.NullOr(SwarmResourceRequirements.SwarmResourceRequirements)),
        RestartPolicy: Schema.optional(Schema.NullOr(SwarmRestartPolicy.SwarmRestartPolicy)),
        Placement: Schema.optional(Schema.NullOr(SwarmPlacement.SwarmPlacement)),
        Networks: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.NullOr(SwarmNetworkAttachmentConfig.SwarmNetworkAttachmentConfig)))
        ),
        LogDriver: Schema.optional(Schema.NullOr(SwarmDriver.SwarmDriver)),
        ForceUpdate: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })
        ),
        Runtime: Schema.optional(Schema.Literals(["container", "plugin", "attachment"])),
    },
    {
        identifier: "SwarmTaskSpec",
        title: "swarm.TaskSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#TaskSpec",
    }
) {}
