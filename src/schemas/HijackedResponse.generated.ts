import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class HijackedResponse extends Schema.Class<HijackedResponse>("HijackedResponse")({
    mediaType: Schema.String,
    Conn: object,
    Reader: MobySchemas.Reader,
}) {}
