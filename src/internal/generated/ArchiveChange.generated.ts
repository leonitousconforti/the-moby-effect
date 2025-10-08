import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ArchiveChange extends Schema.Class<ArchiveChange>("ArchiveChange")(
    {
        Path: Schema.String,
        Kind: EffectSchemas.Number.I64,
    },
    {
        identifier: "ArchiveChange",
        title: "archive.Change",
        documentation: "",
    }
) {}
