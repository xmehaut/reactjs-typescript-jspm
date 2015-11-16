/* */ 
var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, 'build');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var config = {
  entry: [path.join(__dirname, '/src/app/app.jsx')],
  resolve: {extensions: ["", ".js", ".jsx"]},
  devtool: 'source-map',
  output: {
    path: buildPath,
    filename: 'app.js'
  },
  plugins: [new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}), new webpack.NoErrorsPlugin(), new TransferWebpackPlugin([{from: 'www'}], path.resolve(__dirname, "src"))],
  module: {
    preLoaders: [{
      test: /\.(js|jsx)$/,
      loader: 'eslint-loader',
      include: [path.resolve(__dirname, "src/app")],
      exclude: [nodeModulesPath]
    }],
    loaders: [{
      test: /\.(js|jsx)$/,
      loader: 'babel-loader?optional=runtime&stage=0',
      exclude: [nodeModulesPath]
    }]
  },
  eslint: {configFile: '.eslintrc'}
};
module.exports = config;
