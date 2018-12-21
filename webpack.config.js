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
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
}, {
  mode: MODE,
  entry: './src/server/app.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      { test: /\.[jt]sx?$/, loader: 'ts-loader' },
    ],
  },
  node: {
    __dirname: false,
  },
  externals: [nodeExternals()],
}];
