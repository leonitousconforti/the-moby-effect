import * as Schema from "effect/Schema";

/** https://github.com/moby/go-archive/blob/486ec2a261026202c8bf3a9f2dbd9c4b37aaa89d/changes.go#L20-L27 */
export enum ContainerChangeKind {
    Modify = 0,
    Add = 1,
    Delete = 2,
}

export class ContainerChange extends Schema.Class<ContainerChange>("ContainerChange")(
    {
        Path: Schema.String,
        Kind: Schema.Enums(ContainerChangeKind),
    },
    {
        identifier: "ContainerChange",
        title: "archive.Change",
        documentation:
            "https://github.com/moby/go-archive/blob/486ec2a261026202c8bf3a9f2dbd9c4b37aaa89d/changes.go#L41-L48",
    }
) {}
