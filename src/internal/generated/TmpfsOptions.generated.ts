import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class TmpfsOptions extends Schema.Class<TmpfsOptions>("TmpfsOptions")(
    {
        /**
         * Size sets the size of the tmpfs, in bytes.
         *
         * This will be converted to an operating system specific value
         * depending on the host. For example, on linux, it will be converted to
         * use a 'k', 'm' or 'g' syntax. BSD, though not widely supported with
         * docker, uses a straight byte value.
         *
         * Percentages are not supported.
         */
        SizeBytes: Schema.optional(MobySchemas.Int64),

        /** Mode of the tmpfs upon creation */
        Mode: Schema.optional(MobySchemas.UInt32),

        /**
         * Options to be passed to the tmpfs mount. An array of arrays. Flag
         * options should be provided as 1-length arrays. Other types should be
         * provided as 2-length arrays, where the first item is the key and the
         * second the value.
         */
        Options: Schema.optionalWith(Schema.Array(Schema.NullOr(Schema.Array(Schema.String))), { nullable: true }),
    },
    {
        identifier: "TmpfsOptions",
        title: "mount.TmpfsOptions",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/mount/mount.go#L116-L152",
    }
) {}
