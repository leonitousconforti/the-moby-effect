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
export const ConfigIdentifier = Schema.String.pipe(Schema.brand("ConfigId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type ConfigIdentifier = Schema.Schema.Type<typeof ConfigIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ContainerIdentifier = Schema.String.pipe(Schema.brand("ContainerId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type ContainerIdentifier = Schema.Schema.Type<typeof ContainerIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ExecIdentifier = Schema.String.pipe(Schema.brand("ExecId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type ExecIdentifier = Schema.Schema.Type<typeof ExecIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ImageIdentifier = Schema.String.pipe(Schema.brand("ImageId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type ImageIdentifier = Schema.Schema.Type<typeof ImageIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const NetworkIdentifier = Schema.String.pipe(Schema.brand("NetworkId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type NetworkIdentifier = Schema.Schema.Type<typeof NetworkIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const NodeIdentifier = Schema.String.pipe(Schema.brand("NodeId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type NodeIdentifier = Schema.Schema.Type<typeof NodeIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const PluginIdentifier = Schema.String.pipe(Schema.brand("PluginId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type PluginIdentifier = Schema.Schema.Type<typeof PluginIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const SecretIdentifier = Schema.String.pipe(Schema.brand("SecretId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type SecretIdentifier = Schema.Schema.Type<typeof SecretIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ServiceIdentifier = Schema.String.pipe(Schema.brand("ServiceId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type ServiceIdentifier = Schema.Schema.Type<typeof ServiceIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const TaskIdentifier = Schema.String.pipe(Schema.brand("TaskId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type TaskIdentifier = Schema.Schema.Type<typeof TaskIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const VolumeIdentifier = Schema.String.pipe(Schema.brand("VolumeId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type VolumeIdentifier = Schema.Schema.Type<typeof VolumeIdentifier>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const Digest = Function.pipe(
    Schema.String,
    Schema.pattern(/^[a-z0-9]+(?:[@.+_-][a-z0-9]+)*:[a-zA-Z0-9=_-]+$/),
    Schema.brand("Digest")
);

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type Digest = Schema.Schema.Type<typeof Digest>;
