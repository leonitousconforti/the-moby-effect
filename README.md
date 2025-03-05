# the-moby-effect

Moby API client and CLI client built using [effect-ts](http://effect.website). If you want documentation, please consider reading [The Docker API documentation](https://docs.docker.com/engine/api/latest), it is very well written and there is nothing in this library that wouldn't be in there (plus I would just do a worse job if I tried to write my interpretation of their documentation here). If you are just looking for some examples to get your feet underneath you quickly with effect integration, then I do have some of those [here](./examples/).

[![pipeline status](https://git.ltgk.net/leoconforti/the-moby-effect/badges/main/pipeline.svg)](https://git.ltgk.net/leoconforti/the-moby-effect/-/commits/main) [![coverage report](https://git.ltgk.net/leoconforti/the-moby-effect/badges/main/coverage.svg?job=build_job)](https://git.ltgk.net/leoconforti/the-moby-effect/-/commits/main) [![Latest Release](https://git.ltgk.net/leoconforti/the-moby-effect/-/badges/release.svg)](https://git.ltgk.net/leoconforti/the-moby-effect/-/releases)

## Motivation/ideation :bulb:

The motivation for this project come from working with dockerode and I became frustrated with the incorrect types sometimes and the error handling - I did not want to wrap every docker call in a try/catch. Those are the two main reasons why I built the-moby-effect with effect-ts. I also wanted to see if I could build a moby api client that could be used in a web/frontend environment.

## Goals :white_check_mark:

- [x] - local unix socket connections
- [x] - http and https connections
- [x] - ssh connections
- [x] - `DOCKER_HOST` environment variable support
- [x] - streaming, multiplexing, and connection hijacking (just like [dockerode](https://github.com/apocas/dockerode), streams are passed directly through to you)
- [x] - tests, examples, and in-line JSDoc comments based on the moby api documentation
- [x] - Strong focus on types and typescript support
- [x] - Support multiple "engines" (docker, podman, ect). If its built on top of [moby](https://github.com/moby/moby) then it _should_ just work, however, __currently only docker is tested against__
- [x] - Implement all common docker commands except for login/logout because I don't want to interact with credential helpers
- [] - support multiple environments: NodeJs, Bun, Deno, and Web should all be supported but are laking tests
- [] - Callbacks, promise, and effect apis making everyone happy

## Non-Goals :wastebasket:

- Version negotiating: either install a specific version for the moby api that you are targeting or just keep your docker install somewhat up-to-date and you should have no problems

- ~~Promise/callback api: this project is built on-top of effect-ts and uses it quite extensively. While it would be simple to wrap all the apis in `Effect.runPromise` calls, I don't want to do that because you lose the error management, scheduling, concurrency that effect makes so elegant. If you don't want to adopt effect-ts into your entire stack/project, don't fear, you can either wrap everything in a `Effect.runPromise` call yourself or use an effect ManagedRuntime where you are using the-moby-effect.~~

## WIP/Todo :construction:

- More examples
- Enhanced docker compose support
- Callbacks and promise based apis
- Maybe add tests against something else other than docker like podman?

## Blocked :ambulance:

~~DockerCompose support. Blocked only because I have no idea where to even start on this. I'm confident it just reuses the moby api's so there are no new api's, but that means I have to rewrite the docker-compose go plugin in TS which I'm not too thrilled about. Unlike this rest of this project, it's not something that I directly need, which is why I am not too interested in supporting this.~~

Basic docker compose support has been implemented, more to come in the future.

## Compatibility :closed_lock_with_key:

the-moby-effect targets the current stable version of the moby api, which is v1.43 at the time of writing. If you are curious what that translates to for docker versions then take a look at [this](https://docs.docker.com/engine/api/#api-version-matrix) api version matrix published by Docker. As stated in the api version matrix, only Docker v24.0 would be officially supported by the-moby-effect, however, we still test against docker v20, v23, v24, and the next release candidate which is v25 (there is no v21 or v22 btw). Here is another note from Docker:

"The Docker daemon and client don't necessarily need to be the same version at all times. However, keep the following in mind":
1. "If the daemon is newer than the client, the client doesn't know about new features or deprecated API endpoints in the daemon" (shouldn't really happen because the-moby-effect will always target the latest stable api version)
2. "If the client is newer than the daemon, the client can request API endpoints that the daemon doesn't know about" (this could happen, although most of the endpoints are pretty stable at this point so its more like an endpoint parameter might change).

The only compatibility issue found so far is that when using the-moby-effect with docker v20 you can not filter or prune volumes using the `all` filter as it was not present at the time. Other than that all functionality appears to still work.

## Notes :memo:

If you want to use the-moby-effect in a web environment or with the undici agent layer, you can not use the `containerAttach` or the `execStart` (with Detach false) endpoints as both will attempt to reuse the tcp socket from the http request which will not be available in those layers. To use those endpoints, you must be using the Node/Bun/Deno agent layer. Alternatively, if you need to attach to containers in a web environment, you could use the `containerAttachWs` endpoint to achieve similar features over a websocket instead.

## Versioning :rotating_light:

This package does not follow semantic versioning, instead the major and minor part represents the version of the moby api. All bugfixes, breaking or otherwise, will be released under an incremented patch version.

## Library docs :card_file_box:

[https://leoconforti.pages.ltgk.net/the-moby-effect/](https://leoconforti.pages.ltgk.net/the-moby-effect/)

## Contributing and getting help :speech_balloon: :beers:

Contributions, suggestions, and questions are welcome! If you are interested in developing, my recommendation is going to be to use the Devcontainer (even if you don't like them) as it has everything setup already to run the tests or to just let Github actions run the tests. I'll review prs and respond to issues/discussion here on GitHub but if you want more synchronous communication you can find me in the [effect discord](https://discord.gg/effect-ts) as @leonitous

## License :page_facing_up:

If the GNU General Public License v3.0 does not work for you, please reach out and let me know, I can be accommodating
