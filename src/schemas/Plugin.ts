import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { PluginDevice } from "./PluginDevice.js";
import { PluginEnv } from "./PluginEnv.js";
import { PluginInterfaceType } from "./PluginInterfaceType.js";
import { PluginMount } from "./PluginMount.js";

/** A plugin for the Engine API */
export const Plugin = S.Struct({
    Id: S.optional(S.String),
    Name: S.String,
    /**
     * True if the plugin is running. False if the plugin is not running, only
     * installed.
     */
    Enabled: S.Boolean,
    /** Settings that can be modified by users. */
    Settings: S.Struct({
        Mounts: S.Array(PluginMount),
        Env: S.Array(S.String),
        Args: S.Array(S.String),
        Devices: S.Array(PluginDevice),
    }),
    /** Plugin remote reference used to push/pull the plugin */
    PluginReference: S.optional(S.String),
    /** The config of a plugin. */
    Config: S.Struct({
        /** Docker Version used to create the plugin */
        DockerVersion: S.optional(S.String),
        Description: S.String,
        Documentation: S.String,
        /** The interface between Docker and the plugin */
        Interface: S.Struct({
            Types: S.Array(PluginInterfaceType),
            Socket: S.String,
            /** Protocol to use for clients connecting to the plugin. */
            ProtocolScheme: S.optional(S.Literal("", "moby.plugins.http/v1")),
        }),
        Entrypoint: S.Array(S.String),
        WorkDir: S.String,
        User: S.optional(
            S.Struct({
                UID: S.optional(pipe(S.Number, S.int())),
                GID: S.optional(pipe(S.Number, S.int())),
            })
        ),
        Network: S.Struct({
            Type: S.String,
        }),
        Linux: S.Struct({
            Capabilities: S.Array(S.String),
            AllowAllDevices: S.Boolean,
            Devices: S.Array(PluginDevice),
        }),
        PropagatedMount: S.String,
        IpcHost: S.Boolean,
        PidHost: S.Boolean,
        Mounts: S.Array(PluginMount),
        Env: S.Array(PluginEnv),
        Args: S.Struct({
            Name: S.String,
            Description: S.String,
            Settable: S.Array(S.String),
            Value: S.Array(S.String),
        }),
        rootfs: S.optional(
            S.Struct({
                type: S.optional(S.String),
                diff_ids: S.optional(S.Array(S.String)),
            })
        ),
    }),
});

export type Plugin = S.Schema.Type<typeof Plugin>;
export const PluginEncoded = S.encodedSchema(Plugin);
export type PluginEncoded = S.Schema.Encoded<typeof Plugin>;
