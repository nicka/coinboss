const nodeExternals = require('webpack-node-externals'); // eslint-disable-line

module.exports = {
  entry: './handler.js',
  target: 'node',
  externals: [
    nodeExternals(),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: __dirname,
      exclude: /node_modules/,
    }],
  },
};
