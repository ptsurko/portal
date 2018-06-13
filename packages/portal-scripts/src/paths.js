const path = require('path');

const workingDir = process.cwd();

module.exports = {
  workingDir,
  outputPath: path.join(workingDir, 'dist'),
  packageJsonPath: path.join(workingDir, 'package.json'),
  webpackConfigPath: path.join(workingDir, 'webpack.config.js'),
};
