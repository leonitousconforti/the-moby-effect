import * as Schema from "effect/Schema";
import * as ContainerConfig from "./ContainerConfig.generated.js";
import * as ContainerJSONBase from "./ContainerJSONBase.generated.js";
import * as Descriptor from "./Descriptor.generated.js";
import * as MountPoint from "./MountPoint.generated.js";
import * as NetworkSettings from "./NetworkSettings.generated.js";

export class ContainerInspectResponse extends Schema.Class<ContainerInspectResponse>("ContainerInspectResponse")(
    {
        ...ContainerJSONBase.ContainerJSONBase.fields,
        Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(MountPoint.MountPoint))),
        Config: Schema.NullOr(ContainerConfig.ContainerConfig),
        NetworkSettings: Schema.NullOr(NetworkSettings.NetworkSettings),
        ImageManifestDescriptor: Schema.optionalWith(Descriptor.Descriptor, { nullable: true }),
    },
    {
        identifier: "ContainerInspectResponse",
        title: "container.InspectResponse",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/container.go#L179-L188",
    }
) {}
