/*
 * @promotively/config
 *
 * @copyright (c) 2018-2020, Promotively
 * @author Steven Ewing <steven.ewing@promotively.com>
 * @see {@link https://github.com/promotively/config}
 * @license MIT
 */

/*
 * @see {@link https://github.com/promotively/config}
 */

/**
 * Value for the CONFIG_BROWSER_PATH default option which is used when calling getConfig().
 * @constant
 * @type {Object}
 */
const CONFIG_BROWSER_PATH = '/config';

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
  path: CONFIG_BROWSER_PATH
};

/**
 * Value for the CONFIG_DEFAULT_OPTIONS default options object which is used in getConfig().
 * @constant
 * @type {Object}
 */
const CONFIG_DEFAULT_OPTIONS = {
  logger: console,
  path: CONFIG_BROWSER_PATH
};

/**
 * Used to mute console output from the library when params.logger is set to false.
 * @constant
 * @type {Object}
 */
const silentLogger = {
  debug: () => null,
  info: () => null
};

/**
 * Fetches files using the window.fetch API.
 * @param  {...any} args Pass arguments through to window.fetch directly.
 * @returns {Promise} The promise that is returned from the window.fetch API.
 */
const openFile = (...args) => fetch(...args);

/**
 * Converts a response object to text.
 * @param {Object} response Instance of the Response class from the window.fetch API.
 * @returns {String} The string equivalent of the response body.
 */
const parseText = response => response.text();

/**
 * Converts a response object to JSON.
 * @function
 * @param {Object} response Instance of the Response class from the window.fetch API.
 * @returns {Object} The JSON equivalent of the response body.
 */
const parseJSON = response => response.json();

/**
 * Find the current environment.
 * @function
 * @param {Object} params An object that contains options that override the
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

    if (typeof window !== 'undefined' && typeof window[options.file] !== 'undefined') {
      logger.info('found environment in window[ENVIRONMENT]...');

      return resolve(window[options.file]);
    }

    if (typeof process.env !== 'undefined' && process.env.NODE_ENV) {
      logger.info('found environment in process.env.NODE_ENV...');

      return resolve(process.env.NODE_ENV);
    }

    return openFile(`${options.path}/${options.file}`)
      .then(parseText)
      .then(environment => {
        logger.info(`found environment in /${options.path}/${options.file}...`);
        logger.debug(`environment is ${environment}`);

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
    const options = {
      ...CONFIG_DEFAULT_OPTIONS,
      ...params
    };
    const logger = !options.logger ? silentLogger : options.logger;

    return openFile(`${options.path}/${environment}.json`)
      .then(parseJSON)
      .then(config => {
        const { protocol, host, port } = window.location;
        const url = `${protocol}//${host}${port ? `:${port}` : ''}${options.path}/${environment}.json`;

        logger.info(`found config in ${url}...`);
        logger.debug(`config is ${JSON.stringify(config, null, 2)}`);

        return config;
      })
      .then(resolve)
      .catch(reject);
  });
