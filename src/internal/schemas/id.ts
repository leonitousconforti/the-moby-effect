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
export const ContainerId = Schema.String.pipe(Schema.brand("ContainerId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ExecId = Schema.String.pipe(Schema.brand("ExecId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ImageId = Schema.String.pipe(Schema.brand("ImageId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const NetworkId = Schema.String.pipe(Schema.brand("NetworkId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const NodeId = Schema.String.pipe(Schema.brand("NodeId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const PluginId = Schema.String.pipe(Schema.brand("PluginId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const SecretId = Schema.String.pipe(Schema.brand("SecretId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const ServiceId = Schema.String.pipe(Schema.brand("ServiceId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const TaskId = Schema.String.pipe(Schema.brand("TaskId"));

/**
 * @since 1.0.0
 * @category Id Schemas
 */
export const VolumeId = Schema.String.pipe(Schema.brand("VolumeId"));
