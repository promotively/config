/*
 * @promotively/config
 *
 * @copyright (c) 2019, Promotively
 * @author Steven Ewing <steven.ewing@promotively.com>
 * @see {@link https://github.com/promotively/config}
 * @license MIT
 */

import path from 'path';
import { promisify } from 'util';
import { readFile } from 'fs';

/*
 * @see {@link https://github.com/promotively/config}
 */

/**
 * Value for the CONFIG_FOLDER_PATH option which is used when calling getConfig().
 * @constant
 * @type {Object}
 */
const CONFIG_FOLDER_PATH = './config';

/**
 * Value for the CONFIG_ENVIRONMENT_FILE_NAME default option which can be used when calling getEnvironment().
 * @constant
 * @type {Object}
 */
const CONFIG_ENVIRONMENT_FILE_NAME = 'ENVIRONMENT';

/**
 * Value for the CONFIG_DEFAULT_ENVIRONMENT_OPTIONS default options object which is used in getEnvironment().
 * @constant
 * @type {Object}
 */
const CONFIG_DEFAULT_ENVIRONMENT_OPTIONS = {
  file: CONFIG_ENVIRONMENT_FILE_NAME,
  logger: console,
  path: CONFIG_FOLDER_PATH
};

/**
 * Value for the CONFIG_DEFAULT_OPTIONS default options object which is used in getConfig().
 * @constant
 * @type {Object}
 */
const CONFIG_DEFAULT_OPTIONS = {
  logger: console,
  path: CONFIG_FOLDER_PATH
};

/**
 * Used to mute console output from the library when params.logger is set to false.
 * @constant
 * @type {Object}
 */
const silentLogger = {
  info: () => ({})
};

/**
 * Gets files using the fs API.
 * @param  {...any} args Pass arguments through to fs.readFile directly.
 * @returns {Promise} The promise that is returned from the promisified version of the call to the fs API.
 */
const openFile = promisify(readFile);

/**
 * Converts a data object to JSON.
 * @function
 * @param {Object} data Converts a string containing valid JSON into JSON.
 * @returns {Object} The JSON equivalent of the data object specified.
 */
const parseJSON = data => JSON.parse(data);

/**
 * Find the current environment.
 * @function
 * @param {Object} params An object that contains options that override the
 * default options specified in CONFIG_DEFAULT_ENVIRONMENT_OPTIONS.
 * @returns {Promise} A promise that resolves the environment name.
 */
export const getEnvironment = params =>
  new Promise((resolve, reject) => {
    const options = { ...CONFIG_DEFAULT_ENVIRONMENT_OPTIONS, ...params };
    const logger = !options.logger ? silentLogger : options.logger;

    if (typeof global[options.file] !== 'undefined') {
      logger.info('found environment in global[ENVIRONMENT]...');

      return resolve(global[options.file]);
    }

    if (typeof process.env[options.file] !== 'undefined') {
      logger.info('found environment in process.env[ENVIRONMENT]...');

      return resolve(process.env[options.file]);
    }

    if (typeof process.env.NODE_ENV !== 'undefined') {
      logger.info('found environment in process.env.NODE_ENV...');

      return resolve(process.env.NODE_ENV);
    }

    return openFile(`${options.path}/${options.file}`, 'utf8')
      .then(environment => {
        logger.info(`found environment in file://${path.resolve(options.path, options.file)}...`);

        return environment;
      })
      .then(resolve)
      .catch(reject);
  });

/**
 * Get the configuration for the current environment.
 * @function
 * @param {String} environment A string containing the name of the environment.
 * @param {Object} params An object containing options that override the
 * default options specified in CONFIG_DEFAULT_OPTIONS.
 * @returns {Promise} A promise that resolves the configuration for the current environment.
 */
export const getConfig = (environment, params) =>
  new Promise((resolve, reject) => {
    const options = { ...CONFIG_DEFAULT_OPTIONS, ...params };
    const logger = !options.logger ? silentLogger : options.logger;

    return openFile(`${options.path}/${environment}.json`, 'utf8')
      .then(parseJSON)
      .then(config => {
        logger.info(`found config in file://${path.resolve(options.path, environment)}.json...`);

        return config;
      })
      .then(resolve)
      .catch(reject);
  });
