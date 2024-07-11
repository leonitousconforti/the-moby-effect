import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Privileges extends Schema.Class<Privileges>("Privileges")({
    CredentialSpec: MobySchemas.CredentialSpec,
    SELinuxContext: MobySchemas.SELinuxContext,
}) {}
