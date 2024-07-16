import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerJSONBase extends Schema.Class<ContainerJSONBase>("ContainerJSONBase")(
    {
        Id: Schema.String,
        Created: Schema.String,
        Path: Schema.String,
        Args: Schema.NullOr(Schema.Array(Schema.String)),
        State: Schema.NullOr(MobySchemasGenerated.ContainerState),
        Image: Schema.String,
        ResolvConfPath: Schema.String,
        HostnamePath: Schema.String,
        HostsPath: Schema.String,
        LogPath: Schema.String,
        Node: Schema.optional(MobySchemasGenerated.ContainerNode, { nullable: true }),
        Name: Schema.String,
        RestartCount: MobySchemas.Int64,
        Driver: Schema.String,
        Platform: Schema.String,
        MountLabel: Schema.String,
        ProcessLabel: Schema.String,
        AppArmorProfile: Schema.String,
        ExecIDs: Schema.NullOr(Schema.Array(Schema.String)),
        HostConfig: Schema.NullOr(MobySchemasGenerated.ContainerHostConfig),
        GraphDriver: MobySchemasGenerated.GraphDriverData,
        SizeRw: Schema.optional(MobySchemas.Int64, { nullable: true }),
        SizeRootFs: Schema.optional(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "ContainerJSONBase",
        title: "types.ContainerJSONBase",
    }
) {}
