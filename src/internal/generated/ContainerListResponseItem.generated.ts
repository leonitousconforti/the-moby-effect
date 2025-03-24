import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MountPoint from "./MountPoint.generated.js";
import * as Port from "./Port.generated.js";
import * as SummaryNetworkSettings from "./SummaryNetworkSettings.generated.js";

export class ContainerListResponseItem extends Schema.Class<ContainerListResponseItem>("ContainerListResponseItem")(
    {
        Id: Schema.String,
        Names: Schema.NullOr(Schema.Array(Schema.String)),
        Image: Schema.String,
        ImageID: Schema.String,
        Command: Schema.String,
        Created: MobySchemas.Int64,
        Ports: Schema.NullOr(Schema.Array(Schema.NullOr(Port.Port))),
        SizeRw: Schema.optional(MobySchemas.Int64),
        SizeRootFs: Schema.optional(MobySchemas.Int64),
        Labels: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
        State: Schema.String,
        Status: Schema.String,
        HostConfig: Schema.Struct({
            NetworkMode: Schema.optional(Schema.String),
            Annotations: Schema.optionalWith(
                Schema.Record({
                    key: Schema.String,
                    value: Schema.String,
                }),
                { nullable: true }
            ),
        }),
        NetworkSettings: Schema.NullOr(SummaryNetworkSettings.SummaryNetworkSettings),
        Mounts: Schema.NullOr(Schema.Array(Schema.NullOr(MountPoint.MountPoint))),
    },
    {
        identifier: "ContainerListResponseItem",
        title: "types.Container",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/types.go#L140-L161",
    }
) {}
