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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#InspectResponse",
    }
) {}
