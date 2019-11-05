[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM Version](https://badge.fury.io/js/%40promotively%2Fconfig.svg)](https://badge.fury.io/js/%40promotively%2Fconfig)
[![Coverage Status](https://coveralls.io/repos/github/promotively/config/badge.svg)](https://coveralls.io/github/promotively/config)
[![Build Status](https://codebuild.us-west-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiSFpVT01MYW1acC9RYjJ5aU9Jc0k4K1l0NEgxNG03dWZXTDFtVnhzLzZzSEJ5aXVEeGR2SWpOL3lRZEpDQ2IvekJoTHlMYjVsa3loU1dVeW5YZmdhd3BJPSIsIml2UGFyYW1ldGVyU3BlYyI6Ii91VnNqOFNVTENXNk9FNEciLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://aws.amazon.com/codebuild)
[![GitHub Issues](https://img.shields.io/github/issues/promotively/config.svg)](https://github.com/promotively/config/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/promotively/config.svg)](https://GitHub.com/promotively/config/pull/)

# @promotively/config

Universal/isomorphic javascript library for configuration file fetching.

## Why?

* You need a simple and consistent cross platform interface to handle runtime configuration file management.
* You need to have a single set of build artifacts that can be deployed to any environment.
* You want to use the same configuration across your browser and server apps or development tool configuration files.
* You want the ability to quickly change configurations or environments without having to perform application builds. 
* You don't wan't to use webpack.DefinePlugin.

## Installation

With Yarn

`yarn add @promotively/config`

With NPM

`npm install @promotively/config`

## Example

A working example is available inside the ```/example``` folder.

Run ```node example/app.js``` to see your current environment and config.

## Documentation

The source code is documented using JSDoc syntax and documentation is generated using [esdoc](https://github.com/esdoc/esdoc).

Once you have executed ```yarn docs``` documentation is available inside the ```dist/docs``` folder.

Documentation for the most recent release is also [available online](https://promotively-config.s3-us-west-1.amazonaws.com/docs/index.html).

## Setup

Create a file ```config/ENVIRONMENT``` containing the word development.
Create a file ```config/development.json``` containing your app config for development usage.
Create a file ```config/production.json``` containing your app config for production usage.

```javascript
// (optional) config/ENVIRONMENT
```
```text
development
```

```javascript
// config/development.json
```
```json
{
  "APP_PROTOCOL": "http",
  "APP_DOMAIN": "localhost",
  "APP_PORT": 5000
}
```

```javascript
// config/production.json
```
```json
{
  "APP_PROTOCOL": "https",
  "APP_DOMAIN": "app.promotively.com",
  "APP_PORT": 443
}
```

## Usage

```javascript
// app.js

import { getEnvironment, getConfig } from '@promotively/config';

const fetchConfig = async () => {
  try {
    const environment = await getEnvironment();
    const config = await getConfig(environment);
    const result = { environment, config });

    console.info(result);

    return result;
  } catch (error) {
    throw error;
  }
};

export default fetchConfig;
```

In the above example when using ```getEnvironment()``` the NODE_ENV environment variable will be used if set otherwise an ENVIRONMENT variable/file will be used. (global > environment > file)
You can also use a different environment variable or a global variable by configuring options.file with the name of the variable.

## API

| Function | Arguments | Description |
| --- | --- | --- |
| `getEnvironment` | (options) | Fetches the environment using NODE_ENV or an ENVIRONMENT file. |
| `getConfig` | (environment, options) | Set the data loading state. |

## Linting

This library uses [@promotively/eslint-config](https://github.com/promotively/eslint-config) for its ESLint configuration.

```
yarn lint
```

## Tests

This library has 100% unit test code coverage.

Code coverage is available inside the ```dist/coverage``` folder after running ```yarn test```.

Code coverage for the most recent release is also [available online](https://promotively-config.s3-us-west-1.amazonaws.com/tests/index.html).

## Feedback

Feedback is more than welcome via [GitHub](https://github.com/promotively), [Twitter](https://twitter.com/promotively) or our [Website](https://promotively.com).

## License

MIT