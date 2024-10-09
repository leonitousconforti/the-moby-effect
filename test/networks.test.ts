import { layer } from "@effect/vitest";
import { Layer } from "effect";
import * as Networks from "the-moby-effect/endpoints/Networks";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Networks tests", (it) => {
    it.effect("Should list all the networks", () => Networks.Networks.list());
});
