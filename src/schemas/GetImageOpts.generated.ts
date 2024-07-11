import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class GetImageOpts extends Schema.Class<GetImageOpts>("GetImageOpts")({
    Platform: MobySchemas.Platform,
    Details: Schema.Boolean,
}) {}
