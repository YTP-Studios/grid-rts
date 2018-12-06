const path = require('path');
const nodeExternals = require('webpack-node-externals');

const MODE = 'development';

module.exports = [{
  mode: MODE,
  entry: './src/client/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
}, {
  mode: MODE,
  entry: './src/server/app.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
  node: {
    __dirname: false,
  },
  externals: [nodeExternals()],
}];
