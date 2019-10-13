module.exports = {
  destination: './dist/docs',
  plugins: [{
    name: 'esdoc-standard-plugin'
  }, {
    name: 'esdoc-ecmascript-proposal-plugin',
    option: {
      objectRestSpread: true
    }
  }, {
    name: 'esdoc-importpath-plugin',
    option: {
      replaces: [],
      stripPackageName: true
    }
  }],
  source: './src'
};
