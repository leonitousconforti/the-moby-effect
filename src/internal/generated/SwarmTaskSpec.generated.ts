import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as RuntimePluginSpec from "./RuntimePluginSpec.generated.js";
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
        PluginSpec: Schema.optionalWith(RuntimePluginSpec.RuntimePluginSpec, { nullable: true }),
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
        ForceUpdate: EffectSchemas.Number.U64,
        Runtime: Schema.optional(Schema.Literal("container", "plugin", "attachment")),
    },
    {
        identifier: "SwarmTaskSpec",
        title: "swarm.TaskSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#TaskSpec",
    }
) {}
