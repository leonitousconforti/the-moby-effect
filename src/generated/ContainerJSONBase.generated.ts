import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerJSONBase extends Schema.Class<ContainerJSONBase>("ContainerJSONBase")(
    {
        Id: Schema.NullOr(Schema.String),
        Created: Schema.NullOr(Schema.String),
        Path: Schema.NullOr(Schema.String),
        Args: Schema.NullOr(Schema.Array(Schema.String)),
        State: Schema.NullOr(MobySchemasGenerated.ContainerState),
        Image: Schema.NullOr(Schema.String),
        ResolvConfPath: Schema.NullOr(Schema.String),
        HostnamePath: Schema.NullOr(Schema.String),
        HostsPath: Schema.NullOr(Schema.String),
        LogPath: Schema.NullOr(Schema.String),
        Node: Schema.optional(MobySchemasGenerated.ContainerNode, { nullable: true }),
        Name: Schema.NullOr(Schema.String),
        RestartCount: Schema.NullOr(MobySchemas.Int64),
        Driver: Schema.NullOr(Schema.String),
        Platform: Schema.NullOr(Schema.String),
        MountLabel: Schema.NullOr(Schema.String),
        ProcessLabel: Schema.NullOr(Schema.String),
        AppArmorProfile: Schema.NullOr(Schema.String),
        ExecIDs: Schema.NullOr(Schema.Array(Schema.String)),
        HostConfig: Schema.NullOr(MobySchemasGenerated.HostConfig),
        GraphDriver: MobySchemasGenerated.GraphDriverData,
        SizeRw: Schema.optional(MobySchemas.Int64, { nullable: true }),
        SizeRootFs: Schema.optional(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "ContainerJSONBase",
        title: "types.ContainerJSONBase",
    }
) {}
