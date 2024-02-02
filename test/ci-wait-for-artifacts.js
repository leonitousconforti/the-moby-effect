import * as PlatformNode from "@effect/platform-node";
import * as Octokit from "@octokit/rest";
import * as Config from "effect/Config";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Schedule from "effect/Schedule";
import * as NodeFetch from "node-fetch";

const octokit = new Octokit.Octokit({
    auth: process.env["GITHUB_TOKEN"],
    request: { fetch: globalThis.fetch ?? NodeFetch.default },
});

const hasAllArtifacts = Effect.gen(function* (_) {
    const repo = "the-moby-effect";
    const owner = "leonitousconforti";
    const run_id = yield* _(Config.number("GITHUB_RUN_ID"));
    const artifact_count = yield* _(Config.number("GITHUB_ARTIFACT_COUNT"));

    const { data } = yield* _(
        Effect.promise(() =>
            octokit.rest.actions.listWorkflowRunArtifacts({
                owner,
                repo,
                run_id,
            })
        )
    );

    if (data.total_count !== artifact_count) {
        yield* _(Console.log("Not all artifacts are ready"));
        yield* _(Effect.fail(new Error("Not all artifacts are ready")));
    }
});

Function.pipe(
    hasAllArtifacts,
    Effect.retry(Schedule.recurs(30).pipe(Schedule.addDelay(() => 30_000))),
    Effect.provide(PlatformNode.NodeContext.layer),
    PlatformNode.Runtime.runMain
);
