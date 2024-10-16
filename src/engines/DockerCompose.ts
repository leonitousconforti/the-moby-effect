/**
 * Docker compose engine
 *
 * @since 1.0.0
 */

// TODO: implement
export interface DockerComposeImpl {
    up: () => void;
    down: () => void;
    pull: () => void;
    build: () => void;
}
