/**
 * promotively/config
 *
 * @copyright Promotively (c) 2020
 * @author Steven Ewing <steven.ewing@promotively.com>
 * @see {@link https://promotively.com}
 * @see {@link https://github.com/promotively/config}
 * @license MIT
 */

/* eslint-disable no-console */

import 'isomorphic-fetch';
import mockConsole from 'jest-mock-console';
import { getEnvironment, getConfig } from '../src/server';
import mockConfig from './mocks/config/test.json';

const mockEnvironment = 'test';
const defaultOptions = {
  // Use logger: console to help with debugging
  logger: {
    debug: () => null,
    info: () => null
  },
  path: './test/mocks/config'
};

describe('node.js', () => {
  delete process.env.NODE_ENV;

  it(`getEnvironment() should resolve the [ENVIRONMENT] file located in the
  root config folder.`, async () => {
    const environment = await getEnvironment(defaultOptions);

    expect(environment).toEqual(mockEnvironment);
  });

  it('getEnvironment() should resolve the process.env.NODE_ENV variable.', async () => {
    process.env.NODE_ENV = mockEnvironment;

    const environment = await getEnvironment({
      ...defaultOptions,
      logger: false
    });

    delete process.env.NODE_ENV;

    expect(environment).toEqual(mockEnvironment);
  });

  it('getEnvironment() should resolve the process.env[ENVIRONMENT] variable.', async () => {
    process.env.ENVIRONMENT = mockEnvironment;

    const environment = await getEnvironment(defaultOptions);

    delete process.env.ENVIRONMENT;

    expect(environment).toEqual(mockEnvironment);
  });

  it('getEnvironment() should resolve the global[ENVIRONMENT] variable.', async () => {
    global.ENVIRONMENT = mockEnvironment;

    const environment = await getEnvironment(defaultOptions);

    delete global.ENVIRONMENT;

    expect(environment).toEqual(mockEnvironment);
  });

  it(`getEnvironment() should use the internal silent logger when params.logger
  is set to false.`, async () => {
    const restoreMockedConsole = mockConsole();

    await getEnvironment(defaultOptions);

    expect(console.log).not.toHaveBeenCalled();

    restoreMockedConsole();
  });

  it(`getConfig() should resolve the config file for the current environment
  config file located in the root config folder.`, async () => {
    const environment = await getEnvironment(defaultOptions);
    const config = await getConfig(environment, defaultOptions);

    expect(config).toEqual(mockConfig);
  });

  it(`getConfig() should use the internal silent logger when params.logger is
  set to false.`, async () => {
    const restoreMockedConsole = mockConsole();

    const environment = await getEnvironment({
      ...defaultOptions,
      logger: false
    });

    await getConfig(environment, {
      ...defaultOptions,
      logger: false
    });

    expect(console.log).not.toHaveBeenCalled();

    restoreMockedConsole();
  });
});
