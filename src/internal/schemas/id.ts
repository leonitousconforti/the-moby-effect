/**
 * Id schemas.
 *
 * @since 1.0.0
 */

import * as Function from "effect/Function";
import * as Schema from "effect/Schema";

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ConfigIdentifier = Schema.String;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type ConfigIdentifier = Schema.Schema.Type<typeof ConfigIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ContainerIdentifier = Schema.String;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type ContainerIdentifier = Schema.Schema.Type<typeof ContainerIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ExecIdentifier = Schema.String;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type ExecIdentifier = Schema.Schema.Type<typeof ExecIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ImageIdentifier = Schema.String;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type ImageIdentifier = Schema.Schema.Type<typeof ImageIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const NetworkIdentifier = Schema.String;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type NetworkIdentifier = Schema.Schema.Type<typeof NetworkIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const NodeIdentifier = Schema.String;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type NodeIdentifier = Schema.Schema.Type<typeof NodeIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const PluginIdentifier = Schema.String;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type PluginIdentifier = Schema.Schema.Type<typeof PluginIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const SecretIdentifier = Schema.String;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type SecretIdentifier = Schema.Schema.Type<typeof SecretIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ServiceIdentifier = Schema.String;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type ServiceIdentifier = Schema.Schema.Type<typeof ServiceIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const TaskIdentifier = Schema.String;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type TaskIdentifier = Schema.Schema.Type<typeof TaskIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const VolumeIdentifier = Schema.String;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type VolumeIdentifier = Schema.Schema.Type<typeof VolumeIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const Digest = Schema.String;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type Digest = Schema.Schema.Type<typeof Digest>;
