export type PLATFORM_VARIANT =
    | "bun"
    | "bun-undici"
    | "deno"
    | "deno-undici"
    | "node-22.x"
    | "node-24.x"
    | "node-26.x"
    | "node-22.x-undici"
    | "node-24.x-undici"
    | "node-26.x-undici";

declare module "vitest" {
    export interface ProvidedContext {
        __PLATFORM_VARIANT: PLATFORM_VARIANT;
    }
}
