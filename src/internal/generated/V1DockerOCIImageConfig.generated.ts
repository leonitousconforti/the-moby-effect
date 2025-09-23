import * as Schema from "effect/Schema";
import * as V1DockerOCIImageConfigExt from "./V1DockerOCIImageConfigExt.generated.js";
import * as V1ImageConfig from "./V1ImageConfig.generated.js";

export class V1DockerOCIImageConfig extends Schema.Class<V1DockerOCIImageConfig>("V1DockerOCIImageConfig")(
    {
        ...V1ImageConfig.V1ImageConfig.fields,
        ...V1DockerOCIImageConfigExt.V1DockerOCIImageConfigExt.fields,
    },
    {
        identifier: "V1DockerOCIImageConfig",
        title: "v1.DockerOCIImageConfig",
        documentation: "",
    }
) {}
