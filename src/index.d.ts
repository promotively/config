/**
 * promotively/config
 *
 * @copyright Promotively (c) 2020
 * @author Steven Ewing <steven.ewing@promotively.com>
 * @license MIT
 *
 * @see {@link https://promotively.com}
 * @see {@link https://github.com/promotively/config}
 */

/**
 * @see {@link https://github.com/microsoft/typescript}
 */

// Type definitions for @promotively/config

// config interfaces
export interface EnvironmentOptions {
  file?: String;
  logger?: Object;
  path?: String;
}

export interface ConfigOptions {
  file?: String;
  logger?: Object;
  path?: String;
}

// config helpers

export function getEnvironment(params?: EnvironmentOptions): Promise<String>;
export function getConfig(environment: String, params?: ConfigOptions): Promise<Object>;
