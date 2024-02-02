import * as PlatformNode from "@effect/platform-node";
import * as Octokit from "@octokit/rest";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Schedule from "effect/Schedule";

const octokit = new Octokit.Octokit();
const schedule = Schedule.recurs(12).pipe(Schedule.addDelay(() => 5000));

const hasAllArtifacts = Effect.gen(function* (_) {
    const repo = "the-moby-effect";
    const owner = "leonitousconforti";
    const run_id = yield* _(Config.number("GITHUB_RUN_ID"));

    const { data } = yield* _(
        Effect.promise(() =>
            octokit.rest.actions.listWorkflowRunArtifacts({
                owner,
                repo,
                run_id,
            })
        )
    );

    if (data.total_count !== 2 ** 3) {
        yield* _(Effect.fail(new Error("Not all artifacts are ready")));
    }
});

Function.pipe(
    hasAllArtifacts,
    Effect.retry(schedule),
    Effect.provide(PlatformNode.NodeContext.layer),
    PlatformNode.Runtime.runMain
);
