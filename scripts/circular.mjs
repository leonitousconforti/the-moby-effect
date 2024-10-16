/* eslint-disable no-undef */
/* eslint-disable no-console */

import * as glob from "glob";
import madge from "madge";

madge(glob.globSync(["src/**/*.ts"]), {
    detectiveOptions: {
        ts: {
            skipTypeImports: true,
        },
    },
}).then((res) => {
    const circular = res.circular();
    if (circular.length) {
        console.error("Circular dependencies found");
        console.error(circular);
        process.exit(1);
    }
});
