import * as Schema from "effect/Schema";

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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/pkg/archive/changes.go#L43-L50",
    }
) {}
