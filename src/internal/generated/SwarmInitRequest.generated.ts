import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as SwarmSpec from "./SwarmSpec.generated.js";

export class SwarmInitRequest extends Schema.Class<SwarmInitRequest>("SwarmInitRequest")(
    {
        ListenAddr: Schema.String.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => "0.0.0.0:2377")
        ),
        AdvertiseAddr: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        DataPathAddr: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        DataPathPort: MobySchemas.UInt32.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.UInt32.make(0))
        ),
        ForceNewCluster: Schema.Boolean.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => false)),
        Spec: Schema.NullOr(SwarmSpec.SwarmSpec)
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        AutoLockManagers: Schema.Boolean.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => false)
        ),
        Availability: Schema.Literal("active", "pause", "drain")
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => "active")),
        DefaultAddrPool: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => [])),
        SubnetSize: MobySchemas.UInt32.pipe(Schema.propertySignature).pipe(
            Schema.withConstructorDefault(() => MobySchemas.UInt32.make(24))
        ),
    },
    {
        identifier: "SwarmInitRequest",
        title: "swarm.InitRequest",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#InitRequest",
    }
) {}
