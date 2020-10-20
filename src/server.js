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

import path from 'path';
import { promisify } from 'util';
import { readFile } from 'fs';

/* eslint-disable promise/prefer-await-to-then */

/**
 * Value for the CONFIG_FOLDER_PATH option which is used when calling getConfig().
 *
 * @constant
 * @type {object}
 */
const CONFIG_FOLDER_PATH = './config';

/**
 * Value for the CONFIG_ENVIRONMENT_FILE_NAME default option which can be used when calling getEnvironment().
 *
 * @constant
 * @type {object}
 */
const CONFIG_ENVIRONMENT_FILE_NAME = 'ENVIRONMENT';

/**
 * Value for the CONFIG_DEFAULT_ENVIRONMENT_OPTIONS default options object which is used in getEnvironment().
 *
 * @constant
 * @type {object}
 */
const CONFIG_DEFAULT_ENVIRONMENT_OPTIONS = {
  file: CONFIG_ENVIRONMENT_FILE_NAME,
  logger: console,
  path: CONFIG_FOLDER_PATH
};

/**
 * Value for the CONFIG_DEFAULT_OPTIONS default options object which is used in getConfig().
 *
 * @constant
 * @type {object}
 */
const CONFIG_DEFAULT_OPTIONS = {
  logger: console,
  path: CONFIG_FOLDER_PATH
};

/**
 * Used to mute console output from the library when params.logger is set to false.
 *
 * @constant
 * @type {object}
 */
const silentLogger = {
  debug: () => null,
  info: () => null
};

/**
 * Gets files using the fs API.
 *
 * @param  {...any} args Pass arguments through to fs.readFile directly.
 * @returns {Promise} The promise that is returned from the promisified version of the call to the fs API.
 */
const openFile = promisify(readFile);

/**
 * Converts a data object to JSON.
 *
 * @function
 * @param {object} data Converts a string containing valid JSON into JSON.
 * @returns {object} The JSON equivalent of the data object specified.
 */
const parseJSON = data => JSON.parse(data);

/**
 * Find the current environment.
 *
 * @function
 * @param {object} params An object that contains options that override the
 * default options specified in CONFIG_DEFAULT_ENVIRONMENT_OPTIONS.
 * @returns {Promise} A promise that resolves the environment name.
 */
export const getEnvironment = params =>
  new Promise((resolve, reject) => {
    const options = {
      ...CONFIG_DEFAULT_ENVIRONMENT_OPTIONS,
      ...params
    };
    const logger = !options.logger ? silentLogger : options.logger;

    let environment = global[options.file];
    if (typeof environment !== 'undefined') {
      logger.info('found environment in global[ENVIRONMENT]...');
      logger.debug(`environment is ${environment}`);

      return resolve(environment);
    }

    environment = process.env[options.file];
    if (typeof environment !== 'undefined') {
      logger.info('found environment in process.env[ENVIRONMENT]...');
      logger.debug(`environment is ${environment}`);

      return resolve(environment);
    }

    environment = process.env.NODE_ENV;
    if (typeof environment !== 'undefined') {
      logger.info('found environment in process.env.NODE_ENV...');
      logger.debug(`environment is ${environment}`);

      return resolve(environment);
    }

    return openFile(`${options.path}/${options.file}`, 'utf8')
      .then(environment => {
        logger.info(`found environment in file://${path.resolve(options.path, options.file)}...`);
        logger.debug(`environment is ${environment}`);

        return environment;
      })
      .then(resolve)
      .catch(reject);
  });

/**
 * Get the configuration for the current environment.
 *
 * @function
 * @param {string} environment A string containing the name of the environment.
 * @param {object} params An object containing options that override the
 * default options specified in CONFIG_DEFAULT_OPTIONS.
 * @returns {Promise} A promise that resolves the configuration for the current environment.
 */
export const getConfig = (environment, params) =>
  new Promise((resolve, reject) => {
    const options = {
      ...CONFIG_DEFAULT_OPTIONS,
      ...params
    };
    const logger = !options.logger ? silentLogger : options.logger;

    return openFile(`${options.path}/${environment}.json`, 'utf8')
      .then(parseJSON)
      .then(config => {
        logger.info(`found config in file://${path.resolve(options.path, environment)}.json...`);
        logger.debug(`config is ${JSON.stringify(config, null, 2)}`);

        return config;
      })
      .then(resolve)
      .catch(reject);
  });
