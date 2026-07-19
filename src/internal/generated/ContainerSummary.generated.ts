import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";
import * as ContainerMountPoint from "./ContainerMountPoint.generated.ts";
import * as ContainerNetworkSettingsSummary from "./ContainerNetworkSettingsSummary.generated.ts";
import * as ContainerPort from "./ContainerPort.generated.ts";
import * as V1Descriptor from "./V1Descriptor.generated.ts";

export class ContainerSummary extends Schema.Class<ContainerSummary>("ContainerSummary")(
    {
        Id: MobyIdentifiers.ContainerIdentifier,
        Names: Schema.NullOr(Schema.Array(Schema.String)),
        Image: Schema.String,
        ImageID: MobyIdentifiers.ImageIdentifier,
        ImageManifestDescriptor: Schema.optional(Schema.NullOr(V1Descriptor.V1Descriptor)),
        Command: Schema.String,
        Created: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        Ports: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerPort.ContainerPort))),
        SizeRw: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))),
        SizeRootFs: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        State: Schema.String,
        Status: Schema.String,
        HostConfig: Schema.Struct({
        NetworkMode: Schema.optional(Schema.String),
        Annotations: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
})
,
        NetworkSettings: Schema.NullOr(ContainerNetworkSettingsSummary.ContainerNetworkSettingsSummary),
        Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerMountPoint.ContainerMountPoint))),
    },
    {
        identifier: "ContainerSummary",
        title: "container.Summary",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#Summary",
    }
) {}
