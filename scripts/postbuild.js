const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const getFilesFromDirectory = promisify(fs.readdir);
const createFile = promisify(fs.writeFile);
const prependToFile = promisify(require('prepend-file'));
const packageManifest = require('../package.json');

const output = './dist/lib';

const addCopyRightToFiles = async () => {
  const copyright = `/**
 * promotively/config
 *
 * @copyright Promotively (c) 2020
 * @author Steven Ewing <steven.ewing@promotively.com>
 * @see {@link https://promotively.com}
 * @see {@link https://github.com/promotively/config}
 * @license MIT
 */\n\n`;
  const files = await getFilesFromDirectory(output);
  const promises = [];

  files.map(file => promises.push(prependToFile(path.resolve(output, file), copyright)));

  return Promise.all(promises).catch(error => {
    throw error;
  });
};

const createNewPackageJSONFile = () => {
  const { author, dependencies, homepage, name, peerDependencies, repository, version } = packageManifest;

  return createFile(
    path.resolve(output, 'package.json'),
    JSON.stringify({
      author,
      browser: 'browser.js',
      dependencies,
      homepage,
      main: 'server.js',
      name,
      peerDependencies,
      repository,
      version
    })
  ).catch(error => {
    throw error;
  });
};

addCopyRightToFiles()
  .then(createNewPackageJSONFile)
  .catch(error => {
    throw error;
  });
