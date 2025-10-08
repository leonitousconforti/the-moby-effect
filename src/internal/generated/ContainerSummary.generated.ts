import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as ContainerMountPoint from "./ContainerMountPoint.generated.js";
import * as ContainerNetworkSettingsSummary from "./ContainerNetworkSettingsSummary.generated.js";
import * as ContainerPort from "./ContainerPort.generated.js";
import * as V1Descriptor from "./V1Descriptor.generated.js";

export class ContainerSummary extends Schema.Class<ContainerSummary>("ContainerSummary")(
    {
        Id: Schema.String,
        Names: Schema.NullOr(Schema.Array(Schema.String)),
        Image: Schema.String,
        ImageID: Schema.String,
        ImageManifestDescriptor: Schema.optionalWith(V1Descriptor.V1Descriptor, { nullable: true }),
        Command: Schema.String,
        Created: EffectSchemas.Number.I64,
        Ports: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerPort.ContainerPort))),
        SizeRw: Schema.optional(EffectSchemas.Number.I64),
        SizeRootFs: Schema.optional(EffectSchemas.Number.I64),
        Labels: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        State: Schema.String,
        Status: Schema.String,
        HostConfig: Schema.Struct({
            NetworkMode: Schema.optional(Schema.String),
            Annotations: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), {
                nullable: true,
            }),
        }),
        NetworkSettings: Schema.NullOr(ContainerNetworkSettingsSummary.ContainerNetworkSettingsSummary),
        Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerMountPoint.ContainerMountPoint))),
    },
    {
        identifier: "ContainerSummary",
        title: "container.Summary",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#Summary",
    }
) {}
