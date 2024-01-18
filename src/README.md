# Structure

[./agent-helpers.ts] contains the connection agent implementations (http, https, ssh, unix socket)
[./demux-helpers.ts] contains helpers for demultiplexing docker streams from effect http sockets
[./docker-helpers.ts] contains simple implementations of certain docker commands (run, exec, pull, build)
[./request-helpers.ts] contains helpers for making the http requests to the docker endpoints

Any other files contain the implementations of the docker endpoints for the given categories from the docker api documentation.
