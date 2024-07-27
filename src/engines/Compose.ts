/**
 * Docker compose helpers
 *
 * @since 1.0.0
 */

// TODO:
export interface ComposeImpl {
    up: () => void;
    down: () => void;
}
