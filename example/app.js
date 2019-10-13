const { getEnvironment, getConfig } = require('../src/node')

const app = () => {
  const path = './example/config';

  getEnvironment({ path })
    .then((environment) => (
      getConfig(environment, { path })
        .then((config) => ( { environment, config } ))
        .then(console.info)
    )
    .catch(console.error))
};

app();
