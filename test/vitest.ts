import type { GlobalSetupContext } from "vitest/node";

import * as Setup from "./setup.js";
import * as Teardown from "./teardown.js";

export default async function (context: GlobalSetupContext): Promise<() => Promise<void>> {
    const dindInformation = await Setup.setup(context);
    return () => Teardown.teardown(dindInformation?.[1], dindInformation?.[2]);
}
