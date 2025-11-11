export type PLATFORM_VARIANT =
    | "bun"
    | "bun-undici"
    | "deno"
    | "deno-undici"
    | "node-20.x"
    | "node-22.x"
    | "node-24.x"
    | "node-20.x-undici"
    | "node-22.x-undici"
    | "node-24.x-undici";

declare module "vitest" {
    export interface ProvidedContext {
        __PLATFORM_VARIANT: PLATFORM_VARIANT;
    }
}
