import * as Schema from "effect/Schema";
import * as ContainerConfig from "./ContainerConfig.generated.js";
import * as ContainerContainerJSONBase from "./ContainerContainerJSONBase.generated.js";
import * as ContainerMountPoint from "./ContainerMountPoint.generated.js";
import * as ContainerNetworkSettings from "./ContainerNetworkSettings.generated.js";
import * as V1Descriptor from "./V1Descriptor.generated.js";

export class ContainerInspectResponse extends Schema.Class<ContainerInspectResponse>("ContainerInspectResponse")(
    {
        ...ContainerContainerJSONBase.ContainerContainerJSONBase.fields,
        Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerMountPoint.ContainerMountPoint))),
        Config: Schema.NullOr(ContainerConfig.ContainerConfig),
        NetworkSettings: Schema.NullOr(ContainerNetworkSettings.ContainerNetworkSettings),
        ImageManifestDescriptor: Schema.optionalWith(V1Descriptor.V1Descriptor, { nullable: true }),
    },
    {
        identifier: "ContainerInspectResponse",
        title: "container.InspectResponse",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#InspectResponse",
    }
) {}
