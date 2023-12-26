import { Effect } from "effect";

import * as MobyApi from "../src/index.js";
import { testEngines } from "./helpers.js";

const connectionOptions: MobyApi.MobyConnectionOptions = {
    connection: "unix",
    socketPath: "/var/run/docker.sock",
};

const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions(connectionOptions);

export default async function (_globalConfig: unknown, _projectConfig: unknown) {
    await Effect.gen(function* (_: Effect.Adapter) {
        const images: MobyApi.Images.Images = yield* _(MobyApi.Images.Images);

        for (const engineImage of testEngines) {
            yield* _(images.create({ fromImage: engineImage }));
        }
    })
        .pipe(Effect.provide(localDocker))
        .pipe(Effect.runPromise);
}
