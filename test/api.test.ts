import { Effect } from "effect";
import { ContainerSummary, containerList } from "./api.js";

describe("Simple test", () => {
    it("Should fetch a list of containers", async () => {
        const test: readonly ContainerSummary[] = await Effect.runPromise(containerList(true));
        expect(test).toBeInstanceOf(Array);
    });
});
