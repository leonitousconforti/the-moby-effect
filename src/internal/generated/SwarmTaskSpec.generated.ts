import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as PluginSpec from "./PluginSpec.generated.js";
import * as SwarmContainerSpec from "./SwarmContainerSpec.generated.js";
import * as SwarmDriver from "./SwarmDriver.generated.js";
import * as SwarmNetworkAttachmentConfig from "./SwarmNetworkAttachmentConfig.generated.js";
import * as SwarmNetworkAttachmentSpec from "./SwarmNetworkAttachmentSpec.generated.js";
import * as SwarmPlacement from "./SwarmPlacement.generated.js";
import * as SwarmResourceRequirements from "./SwarmResourceRequirements.generated.js";
import * as SwarmRestartPolicy from "./SwarmRestartPolicy.generated.js";

export class SwarmTaskSpec extends Schema.Class<SwarmTaskSpec>("SwarmTaskSpec")(
    {
        ContainerSpec: Schema.optionalWith(SwarmContainerSpec.SwarmContainerSpec, { nullable: true }),
        PluginSpec: Schema.optionalWith(PluginSpec.PluginSpec, { nullable: true }),
        NetworkAttachmentSpec: Schema.optionalWith(SwarmNetworkAttachmentSpec.SwarmNetworkAttachmentSpec, {
            nullable: true,
        }),
        Resources: Schema.optionalWith(SwarmResourceRequirements.SwarmResourceRequirements, { nullable: true }),
        RestartPolicy: Schema.optionalWith(SwarmRestartPolicy.SwarmRestartPolicy, { nullable: true }),
        Placement: Schema.optionalWith(SwarmPlacement.SwarmPlacement, { nullable: true }),
        Networks: Schema.optionalWith(
            Schema.Array(Schema.NullOr(SwarmNetworkAttachmentConfig.SwarmNetworkAttachmentConfig)),
            { nullable: true }
        ),
        LogDriver: Schema.optionalWith(SwarmDriver.SwarmDriver, { nullable: true }),
        ForceUpdate: MobySchemas.UInt64,
        Runtime: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmTaskSpec",
        title: "swarm.TaskSpec",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/task.go#L72-L97",
    }
) {}
