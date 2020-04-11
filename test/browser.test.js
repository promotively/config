/*
 * @promotively/config
 *
 * @copyright (c) 2018-2020, Promotively
 * @author Steven Ewing <steven.ewing@promotively.com>
 * @see {@link https://github.com/promotively/config}
 * @license MIT
 */

/* eslint-disable no-console */

import fetchMock from 'fetch-mock';
import mockConsole from 'jest-mock-console';
import { getEnvironment, getConfig } from '../src/browser';
import mockConfig from './mocks/config/test.json';

const mockEnvironment = 'test';
const defaultOptions = {
  // Use logger: console to help with debugging
  logger: {
    debug: () => null,
    info: () => null
  }
};

describe('browser.js', () => {
  delete process.env.NODE_ENV;

  beforeAll(() => {
    fetchMock.get('/config/ENVIRONMENT', mockEnvironment);
    fetchMock.get(`/config/${mockEnvironment}.json`, mockConfig);
  });

  afterAll(() => fetchMock.reset());

  it(`getEnvironment() should resolve the [ENVIRONMENT] file located in the
  root config folder.`, async () => {
    const environment = await getEnvironment(defaultOptions);

    expect(environment).toEqual(mockEnvironment);
  });

  it('getEnvironment() should resolve the window[ENVIRONMENT] variable.', async () => {
    global.window = {
      ENVIRONMENT: mockEnvironment
    };

    const environment = await getEnvironment({
      ...defaultOptions,
      logger: false
    });

    expect(environment).toEqual(mockEnvironment);

    delete global.window;
  });

  it('getEnvironment() should resolve the process.env.NODE_ENV variable.', async () => {
    process.env.NODE_ENV = mockEnvironment;

    const environment = await getEnvironment(defaultOptions);

    expect(environment).toEqual(mockEnvironment);

    delete process.env.NODE_ENV;
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
    global.window = {
      location: {
        host: 'localhost',
        port: '',
        protocol: 'http'
      }
    };

    const environment = await getEnvironment(defaultOptions);
    const config = await getConfig(environment, defaultOptions);

    expect(config).toEqual(mockConfig);

    delete global.window;
  });

  it(`getConfig() should use the internal silent logger when params.logger is
  set to false.`, async () => {
    global.window = {
      location: {
        host: 'localhost',
        port: '80',
        protocol: 'http'
      }
    };

    const restoreMockedConsole = mockConsole();
    const environment = await getEnvironment(defaultOptions);

    await getConfig(environment, {
      ...defaultOptions,
      logger: false
    });

    expect(console.log).not.toHaveBeenCalled();

    delete global.window;

    restoreMockedConsole();
  });
});
