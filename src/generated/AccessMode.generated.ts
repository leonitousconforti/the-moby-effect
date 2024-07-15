import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class AccessMode extends Schema.Class<AccessMode>("AccessMode")(
    {
        /** The set of nodes this volume can be used on at one time. */
        Scope: Schema.optional(Schema.Literal("single", "multi")),

        /**
         * The number and way that different tasks can use this volume at one
         * time.
         */
        Sharing: Schema.optional(Schema.Literal("none", "readonly", "onewriter", "all")),

        /** Options for using this volume as a Mount-type volume. */
        MountVolume: Schema.optional(MobySchemasGenerated.TypeMount, { nullable: true }),

        /** Options for using this volume as a Block-type volume. */
        BlockVolume: Schema.optional(MobySchemasGenerated.TypeBlock, { nullable: true }),
    },
    {
        identifier: "AccessMode",
        title: "volume.AccessMode",
    }
) {}
