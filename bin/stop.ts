import { Command, Options } from "@effect/cli";
import { DockerEngine } from "the-moby-effect";

export const command = Command.make(
    "stop",
    {
        container: Options.text("container"),
    },
    ({ container }) => DockerEngine.stop(container)
);
