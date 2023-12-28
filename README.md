# the-moby-effect

Moby API client built using [effect-ts](http://effect.website). If you want documentation, please consider reading [The Docker API documentation](https://docs.docker.com/engine/api/latest), it is very well written and there is nothing in this library that wouldn't be in there (plus I would just do a worse job if I tried to write my interpretation of their documentation here). If you are just looking for some examples to get your feet underneath you quickly with effect integration, then I do have some of those [here](./examples/).

## Goals

- [x] - local unix socket connections
- [x] - http and https connections
- [x] - ssh connections
- [x] - `DOCKER_HOST` environment variable support
- [x] - streaming (just like [dockerode](https://github.com/apocas/dockerode), streams are passed directly through to you)
- [x] - tests, examples, and in-line JSDoc comments based on the moby api documentation
- [x] - Strong focus on types and typescript support
- [x] - Support multiple "engines" (docker, podman, ect). If its built on top of [moby](https://github.com/moby/moby) then it _should_ just work, however, __currently only docker is tested against__

## Non-Goals

- Tighter schema: the moby api schema is pretty loose as it aims to be backwards compatible - almost nothing is explicitly marked as required and object properties are optional by default under the swagger2.0/openapi specification. I have no intention to try to tighten their schema in my project. If the moby schema doesn't explicitly mark it as a required field, then it will be optional.

- Version negotiating: either install a specific version for the moby api that you are targeting or just keep your docker install somewhat up-to-date and you should have no problems

## Todo/Future
- Add more examples
- Maybe add tests against something else other than docker like podman?
- Patch upstream @effect/platform-node to support just streaming responses, needed for session and container attach endpoints: [upstream pr](https://github.com/Effect-TS/platform/pull/375)

## Compatibility

the-moby-effect targets the current stable version of the moby api, which is v1.43 at the time of writing. If you are curious what that translates to for docker versions then take a look at [this](https://docs.docker.com/engine/api/#api-version-matrix) api version matrix published by Docker. As stated in the api version matrix, only Docker v24.0 would be officially supported by the-moby-effect, however, we still test against docker v20, v23, v24, and the next release candidate which is v25 (there is no v21 or v22 btw). Here is another note from Docker:

"The Docker daemon and client don't necessarily need to be the same version at all times. However, keep the following in mind":
1. "If the daemon is newer than the client, the client doesn't know about new features or deprecated API endpoints in the daemon" (shouldn't really happen because the-moby-effect will always target the latest stable api version)
2. "If the client is newer than the daemon, the client can request API endpoints that the daemon doesn't know about" (this could happen, although most of the endpoints are pretty stable at this point so its more like an endpoint parameter might change).

The only compatibility issue found so far is that when using the-moby-effect with docker v20 you can not filter or prune volumes using the `all` filter as it was not present at the time. Other than that all functionality appears to still work.

## Versioning

This package does not follow semantic versioning, instead the major and minor part represents the version of the moby api. All bugfixes, breaking or otherwise, will be released under an incremented patch version.

## Contributing and getting help

Contributions, suggestions, and questions are welcome! I'll review prs and respond to issues/discussion here on GitHub but if you want more direct and probably quicker communication you can find me in the [effect discord](https://discord.gg/effect-ts) as @leonitous
