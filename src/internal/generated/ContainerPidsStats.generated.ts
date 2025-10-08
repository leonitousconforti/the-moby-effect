import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ContainerPidsStats extends Schema.Class<ContainerPidsStats>("ContainerPidsStats")(
    {
        current: Schema.optional(EffectSchemas.Number.U64),
        limit: Schema.optional(EffectSchemas.Number.U64),
    },
    {
        identifier: "ContainerPidsStats",
        title: "container.PidsStats",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#PidsStats",
    }
) {}
