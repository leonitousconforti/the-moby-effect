import * as Schema from "effect/Schema";

export class SwarmConfigReferenceFileTarget extends Schema.Class<SwarmConfigReferenceFileTarget>("SwarmConfigReferenceFileTarget")(
    {
        Name: Schema.String,
        UID: Schema.String,
        GID: Schema.String,
        Mode: Schema.NumberFromString.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 })),
    },
    {
        identifier: "SwarmConfigReferenceFileTarget",
        title: "swarm.ConfigReferenceFileTarget",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ConfigReferenceFileTarget",
    }
) {}
