import * as Schema from "effect/Schema";
import * as V1HealthcheckConfig from "./V1HealthcheckConfig.generated.ts";

export class V1DockerOCIImageConfigExt extends Schema.Class<V1DockerOCIImageConfigExt>("V1DockerOCIImageConfigExt")(
    {
        Healthcheck: Schema.optional(Schema.NullOr(V1HealthcheckConfig.V1HealthcheckConfig)),
        OnBuild: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        Shell: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
    },
    {
        identifier: "V1DockerOCIImageConfigExt",
        title: "v1.DockerOCIImageConfigExt",
        documentation: "",
    }
) {}
