import * as Schema from "effect/Schema";
import * as V1HealthcheckConfig from "./V1HealthcheckConfig.generated.js";

export class V1DockerOCIImageConfigExt extends Schema.Class<V1DockerOCIImageConfigExt>("V1DockerOCIImageConfigExt")(
    {
        Healthcheck: Schema.optionalWith(V1HealthcheckConfig.V1HealthcheckConfig, { nullable: true }),
        OnBuild: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Shell: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "V1DockerOCIImageConfigExt",
        title: "v1.DockerOCIImageConfigExt",
        documentation: "",
    }
) {}
