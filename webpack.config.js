var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var loaders = [
  {
    "test": /\.js?$/,
    "exclude": /node_modules/,
    "loader": "babel"
  },
  {
    "test": /\.vue?$/,
    "loader": "vue"
  }
];

module.exports = {
  devtool: 'eval-source-map',
  entry: path.resolve('src', 'main.js'),
  output: {
    path: path.resolve('build'),
    filename: 'bundle.js',
    publicPath: ''
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('src', 'index.tpl.html'),
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.ProvidePlugin({
      $: "jquery"
    })
  ],
  module: {
    loaders: loaders
  }
};
