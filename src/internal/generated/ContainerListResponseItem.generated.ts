import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as Descriptor from "./Descriptor.generated.js";
import * as MountPoint from "./MountPoint.generated.js";
import * as NetworkSettingsSummary from "./NetworkSettingsSummary.generated.js";
import * as Port from "./Port.generated.js";

export class ContainerListResponseItem extends Schema.Class<ContainerListResponseItem>("ContainerListResponseItem")(
    {
        Id: Schema.String,
        Names: Schema.NullOr(Schema.Array(Schema.String)),
        Image: Schema.String,
        ImageID: Schema.String,
        ImageManifestDescriptor: Schema.optionalWith(Descriptor.Descriptor, { nullable: true }),
        Command: Schema.String,
        Created: MobySchemas.Int64,
        Ports: Schema.NullOr(Schema.Array(Schema.NullOr(Port.Port))),
        SizeRw: Schema.optional(MobySchemas.Int64),
        SizeRootFs: Schema.optional(MobySchemas.Int64),
        Labels: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        State: Schema.String,
        Status: Schema.String,
        HostConfig: Schema.Struct({
            NetworkMode: Schema.optional(Schema.String),
            Annotations: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), {
                nullable: true,
            }),
        }),
        NetworkSettings: Schema.NullOr(NetworkSettingsSummary.NetworkSettingsSummary),
        Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(MountPoint.MountPoint))),
    },
    {
        identifier: "ContainerListResponseItem",
        title: "container.Summary",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/container.go#L121-L143",
    }
) {}
