/*
 * @promotively/react-redux-data
 *
 * @copyright (c) 2018-2020, Promotively
 * @author Steven Ewing <steven.ewing@promotively.com>
 * @see {@link https://github.com/promotively/config}
 * @license MIT
 */

/**
 * @see {@link https://github.com/microsoft/typescript}
 */

// Type definitions for @promotively/config

export interface iEnvironmentOptions {
  file?: String;
  logger?: Object;
  path?: String;
}

export interface iConfigOptions {
  file?: String;
  logger?: Object;
  path?: String;
}

export function getEnvironment(params?: iEnvironmentOptions): Promise<String>;
export function getConfig(environment: String, params?: iConfigOptions): Promise<Object>;
