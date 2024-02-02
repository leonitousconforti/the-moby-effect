import * as Config from "effect/Config";
import * as Effect from "effect/Effect";

import * as MobyApi from "../src/index.js";
import { testEngines } from "./unit/helpers.js";

const connectionOptions: MobyApi.MobyConnectionOptions = {
    connection: "socket",
    socketPath: "/var/run/docker.sock",
};

const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions(connectionOptions);

export default async function (_globalConfig: unknown, _projectConfig: unknown) {
    await Effect.gen(function* (_: Effect.Adapter) {
        if (process.platform === "win32") {
            const windows_testing_host: string = yield* _(Config.string("windows_testing_host"));
        }

        const images: MobyApi.Images.Images = yield* _(MobyApi.Images.Images);

        for (const engineImage of testEngines) {
            yield* _(images.create({ fromImage: engineImage }));
        }
    })
        .pipe(Effect.provide(localDocker))
        .pipe(Effect.runPromise);
}

const a = globalThis["__THE_MOBY_EFFECT_TEST_HOST"];
