const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('../paths');

module.exports = ({ containerSettings, mode, apps }) => {
  return {
    mode,
    entry: path.join(paths.workingDir, 'src/index.js'),
    output: {
      path: paths.outputPath,
      filename: 'bundle.js',
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
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(paths.workingDir, 'public', 'index.html'),
      }),
      new webpack.DefinePlugin({
        PORTAL_APPS: JSON.stringify(apps),
      }),
    ],
  };
}
