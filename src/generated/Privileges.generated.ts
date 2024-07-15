import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class Privileges extends Schema.Class<Privileges>("Privileges")(
    {
        CredentialSpec: Schema.NullOr(MobySchemasGenerated.CredentialSpec),
        SELinuxContext: Schema.NullOr(MobySchemasGenerated.SELinuxContext),
    },
    {
        identifier: "Privileges",
        title: "swarm.Privileges",
    }
) {}
