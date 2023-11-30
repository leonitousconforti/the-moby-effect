// [
//     {
//         Id: "076e8836e221d40411064eaa6aab0c5b3d2e333873d5f39b1530e9712e1265ba",
//         Names: ["/intelligent_dhawan"],
//         Image: "hello-world",
//         ImageID: "sha256:9c7a54a9a43cca047013b82af109fe963fde787f63f9e016fdc3384500c2823d",
//         Command: "/hello",
//         Created: 1701200316,
//         Ports: [],
//         Labels: {},
//         State: "exited",
//         Status: "Exited (0) 8 hours ago",
//         HostConfig: { NetworkMode: "default" },
//         NetworkSettings: { Networks: [Object] },
//         Mounts: [],
//     },
// ];

import { Effect } from "effect";
import { ContainerSummary, containerList } from "../src/api.js";

const data: readonly ContainerSummary[] = await Effect.runPromise(
    containerList({ protocol: "unix", socketPath: "/var/run/docker.sock" }, true)
);
console.log(data);
