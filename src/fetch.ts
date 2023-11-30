import ssh2 from "ssh2";
import undici from "undici";
import { Match, pipe } from "effect";

export type MobyConnectionOptions =
    | { protocol: "http"; host: string; port: number }
    | { protocol: "https"; host: string; port: number }
    | ({ protocol: "ssh" } & ssh2.ConnectConfig)
    | { protocol: "unix"; socketPath: string };

export const makeUrl = (connectionOptions: MobyConnectionOptions): string =>
    pipe(
        Match.value<MobyConnectionOptions>(connectionOptions),
        Match.when({ protocol: "ssh" }, () => ""),
        Match.when({ protocol: "unix" }, () => "http://localhost"),
        Match.whenOr(
            { protocol: "http" },
            { protocol: "https" },
            ({ protocol, host, port }) => `${protocol}://${host}:${port}`
        ),
        Match.exhaustive
    );

export const makeDispatcher = (connectionOptions: MobyConnectionOptions): RequestInit =>
    // FIXME: undici.RequestInit and nodejs RequestInit types are different
    // right now, Check to see if they are fixed with updates to @types/node
    pipe(
        Match.value<MobyConnectionOptions>(connectionOptions),
        Match.when({ protocol: "unix" }, ({ socketPath }) => ({
            dispatcher: new undici.Client("http://localhost", { socketPath }),
        })),
        Match.when({ protocol: "ssh" }, () => {
            throw new Error("Not implemented");
        }),
        Match.whenOr({ protocol: "http" }, { protocol: "https" }, () => ({})),
        Match.exhaustive
    ) as RequestInit;
