# Structure

[agent-helpers.ts](./agent-helpers.ts) contains the connection agent implementations (http, https, ssh, unix socket)
<br>
[demux-helpers.ts](./demux-helpers.ts) contains helpers for demultiplexing docker streams from effect http sockets
<br>
[docker-helpers.ts](./docker-helpers.ts) contains simple implementations of certain docker commands (run, exec, pull, build)
<br>
[request-helpers.ts](./request-helpers.ts) contains helpers for making the http requests to the docker endpoints
<br>
[schemas.ts](./schemas.ts) contains @effect/schema definitions from the moby swagger2 document

Any other files contain the implementations of the docker endpoints for the given categories from the docker api documentation.
