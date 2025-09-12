/**
 * Id schemas.
 *
 * @since 1.0.0
 */

import * as Schema from "effect/Schema";

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ConfigId = Schema.String.pipe(Schema.brand("ConfigId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type ConfigId = Schema.Schema.Type<typeof ConfigId>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ContainerId = Schema.String.pipe(Schema.brand("ContainerId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type ContainerId = Schema.Schema.Type<typeof ContainerId>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ExecId = Schema.String.pipe(Schema.brand("ExecId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type ExecId = Schema.Schema.Type<typeof ExecId>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ImageId = Schema.String.pipe(Schema.brand("ImageId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type ImageId = Schema.Schema.Type<typeof ImageId>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const NetworkId = Schema.String.pipe(Schema.brand("NetworkId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type NetworkId = Schema.Schema.Type<typeof NetworkId>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const NodeId = Schema.String.pipe(Schema.brand("NodeId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type NodeId = Schema.Schema.Type<typeof NodeId>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const PluginId = Schema.String.pipe(Schema.brand("PluginId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type PluginId = Schema.Schema.Type<typeof PluginId>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const SecretId = Schema.String.pipe(Schema.brand("SecretId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type SecretId = Schema.Schema.Type<typeof SecretId>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ServiceId = Schema.String.pipe(Schema.brand("ServiceId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type ServiceId = Schema.Schema.Type<typeof ServiceId>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const TaskId = Schema.String.pipe(Schema.brand("TaskId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type TaskId = Schema.Schema.Type<typeof TaskId>;

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const VolumeId = Schema.String.pipe(Schema.brand("VolumeId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export type VolumeId = Schema.Schema.Type<typeof VolumeId>;
