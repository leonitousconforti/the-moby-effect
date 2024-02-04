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
        const node_environment: string = yield* _(Config.string("NODE_ENV"));

        if (node_environment !== "ci") {
            yield* _(Effect.fail("Tests are meant to run in CI only"));
        }

        const images: MobyApi.Images.Images = yield* _(MobyApi.Images.Images);

        for (const engineImage of testEngines) {
            yield* _(images.create({ fromImage: engineImage }));
        }
    })
        .pipe(Effect.provide(localDocker))
        .pipe(Effect.runPromise);
}
