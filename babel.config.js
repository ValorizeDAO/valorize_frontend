
module.exports = {
  presets: [
    [
    '@babel/preset-env',
    { targets: { node: '16.14.2' } },
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    "babel-plugin-transform-import-meta",
    function () {
      return {
        visitor: {
          MetaProperty(path) {
            path.replaceWithSourceString('process')
          },
        },
      }
    },
  ],
}
