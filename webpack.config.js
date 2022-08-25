const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, path.resolve(__dirname, './src/test/')],
        use: 'babel-loader'
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/api/v1/views/'),
          to: path.resolve(__dirname, './build/api/v1/views/')
        }
      ]
    })
  ],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['*', '.js'],
    fallback: {
      path: false,
      assert: false,
      crypto: false,
      http: false,
      https: false,
      constants: false,
      os: false,
      stream: false,
      zlib: false,
      fs: false,
      tls: false,
      net: false,
      dns: false,
      child_process: false,
      'aws-sdk': false,
      nock: false,
      'mock-aws-s3': false,
      npm: false,
      'node-gyp': false,
      url: false,
      util: false,
      querystring: false
    },
    alias: {
      handlebars: 'handlebars/dist/handlebars.js'
    }
  },
  target: 'node',
  externals: [nodeExternals()]
};
