import * as Schema from "effect/Schema";

import * as ContainerConfig from "./ContainerConfig.generated.ts";
import * as ContainerContainerJSONBase from "./ContainerContainerJSONBase.generated.ts";
import * as ContainerMountPoint from "./ContainerMountPoint.generated.ts";
import * as ContainerNetworkSettings from "./ContainerNetworkSettings.generated.ts";
import * as V1Descriptor from "./V1Descriptor.generated.ts";

export class ContainerInspectResponse extends Schema.Class<ContainerInspectResponse>("ContainerInspectResponse")(
    {
        ...ContainerContainerJSONBase.ContainerContainerJSONBase.fields,
        Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerMountPoint.ContainerMountPoint))),
        Config: Schema.NullOr(ContainerConfig.ContainerConfig),
        NetworkSettings: Schema.NullOr(ContainerNetworkSettings.ContainerNetworkSettings),
        ImageManifestDescriptor: Schema.optional(Schema.NullOr(V1Descriptor.V1Descriptor)),
    },
    {
        identifier: "ContainerInspectResponse",
        title: "container.InspectResponse",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#InspectResponse",
    }
) {}
