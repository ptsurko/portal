const path = require('path');
const paths = require('../paths');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = ({ appSettings, mode }) => ({
  mode,
  entry: path.join(paths.workingDir, appSettings.entry),
  output: {
    path: paths.outputPath,
    filename: 'bundle.js',
    library: appSettings.appName,
    libraryExport: "default",
    libraryTarget: "umd",
  },
  // resolve: {
  //   modules: ['node_modules', '../../node_modules'],
  //   alias: {
  //   },
  //   extensions: ['.js', '.jsx'],
  // },
  devtool: '',
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [{
        loader: require.resolve('babel-loader'),
      }],
    // }, {
    //   test: /\.css$/,
    //   loader: 'style-loader',
    // }, {
    //   test: /\.css$/,
    //   loader: 'css-loader',
    // }, {
    //   test: /\.less$/,
    //   use: [{
    //     loader: 'style-loader'
    //   }, {
    //     loader: 'css-loader'
    //   }, {
    //     loader: 'less-loader'
    //   }]
    // }, {
    //   test: /\.(png|jpg|gif)$/,
    //   loader: 'file-loader',
    }],
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     template: path.join(workingDir, 'public', 'index.html'),
  //   }),
  // ],
});
