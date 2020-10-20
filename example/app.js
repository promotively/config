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
/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable promise/no-nesting */

const { getEnvironment, getConfig } = require('../src/browser');

const app = () => {
  const path = './example/config';

  getEnvironment({ path })
    .then(environment =>
      getConfig(environment, { path })
        .then(config => ({ config, environment }))
        .then(console.info)
        .catch(console.error)
    )
    .catch(console.error);
};

app();
