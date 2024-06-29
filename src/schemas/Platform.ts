import { Schema as S } from "@effect/schema";

/** Platform represents the platform (Arch/OS). */
export const Platform = S.Struct({
    /**
     * Architecture represents the hardware architecture (for example,
     * `x86_64`).
     */
    Architecture: S.optional(S.String),
    /** OS represents the Operating System (for example, `linux` or `windows`). */
    OS: S.optional(S.String),
});

export type Platform = S.Schema.Type<typeof Platform>;
export const PlatformEncoded = S.encodedSchema(Platform);
export type PlatformEncoded = S.Schema.Encoded<typeof Platform>;
