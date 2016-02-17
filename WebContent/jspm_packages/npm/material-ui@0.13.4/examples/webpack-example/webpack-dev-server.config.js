/* */ 
var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname, 'build');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var config = {
  entry: ['webpack/hot/dev-server', 'webpack/hot/only-dev-server', path.join(__dirname, '/src/app/app.jsx')],
  resolve: {extensions: ["", ".js", ".jsx"]},
  devServer: {
    contentBase: 'src/www',
    devtool: 'eval',
    hot: true,
    inline: true,
    port: 3000
  },
  devtool: 'eval',
  output: {
    path: buildPath,
    filename: 'app.js'
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin(), new TransferWebpackPlugin([{from: 'www'}], path.resolve(__dirname, "src"))],
  module: {
    preLoaders: [{
      test: /\.(js|jsx)$/,
      loader: 'eslint-loader',
      include: [path.resolve(__dirname, "src/app")],
      exclude: [nodeModulesPath]
    }],
    loaders: [{
      test: /\.(js|jsx)$/,
      loaders: ['react-hot', 'babel-loader?optional=runtime&stage=0'],
      exclude: [nodeModulesPath]
    }]
  },
  eslint: {configFile: '.eslintrc'}
};
module.exports = config;
