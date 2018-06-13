#!/usr/bin/env node

const program = require('commander');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const paths = require('./paths');
const {
  MODE_DEVELOPMENT,
  MODE_PRODUCTION,
  mergeWebpackConfigs,
  loadAppSettings,
  loadContainerSettings,
  loadCustomWebpackConfig,
  loadListOfApps,
} = require('./utils');
const appWebpackConfig = require('./config/app.webpack.config');
const containerWebpackConfig = require('./config/container.webpack.config');

const DEFAULT_PORT = 3000;
const HOSTNAME = 'localhost';

const runWebpack = (webpackConfig) => {
  const compiler = webpack(webpackConfig);
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      console.log('Webpack error: ', err);
    }

    console.log(stats.toString({
      chunks: false,  // Makes the build much quieter
      colors: true    // Shows colors in the console
    }));
  });
};

const startWebpackDevServer = (webpackConfig, port, options) => {
  const server = new WebpackDevServer(webpack(webpackConfig), options);
  server.listen(port, HOSTNAME, function (err) {
    if (err) {
      console.log(err);
    }
    console.log(`WebpackDevServer listening at ${HOSTNAME}:`, port);
  });

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
      server.close(() => process.exit());
    });
  });
};

const buildAppWebpackConfig = (mode) => {
  const appSettings = loadAppSettings();
  const defaultWebpackConfig = appWebpackConfig({ appSettings, mode });
  const customWebpackConfig = loadCustomWebpackConfig();
  return mergeWebpackConfigs(defaultWebpackConfig, customWebpackConfig, mode);
}

const buildContainerWebpackConfig = (mode) => {
  const containerSettings = loadContainerSettings();
  const apps = loadListOfApps();
  const defaultWebpackConfig = containerWebpackConfig({
    containerSettings,
    mode,
    apps,
  });
  const customWebpackConfig = loadCustomWebpackConfig();
  return mergeWebpackConfigs(defaultWebpackConfig, customWebpackConfig, mode);
}

const WEBPACK_CONFIG_BUILDERS = {
  app: buildAppWebpackConfig,
  container: buildContainerWebpackConfig,
}

program
  .command('build [target]')
  .option('-p, --production', 'Production mode')
  .action((target, cmd) => {
    if (!WEBPACK_CONFIG_BUILDERS[target]) {
      console.error(`Target ${target} is not supported. Use ${Object.keys(WEBPACK_CONFIG_BUILDERS).join(', ')}`)
      return;
    }
    const buildWebpackConfig = WEBPACK_CONFIG_BUILDERS[target];
    const mode = cmd.production ? MODE_PRODUCTION : MODE_DEVELOPMENT;
    const webpackConfig = buildWebpackConfig(mode);
    runWebpack(webpackConfig);
  });

program
  .command('start [target]')
  .option('-p, --production', 'Production mode')
  .option('--port <port>', 'Port')
  .action((target, cmd) => {
    if (!WEBPACK_CONFIG_BUILDERS[target]) {
      console.error(`Target ${target} is not supported. Use ${Object.keys(WEBPACK_CONFIG_BUILDERS).join(', ')}`)
      return;
    }

    const buildWebpackConfig = WEBPACK_CONFIG_BUILDERS[target];
    const mode = cmd.production ? MODE_PRODUCTION : MODE_DEVELOPMENT;
    const port = cmd.port || DEFAULT_PORT;
    const webpackConfig = buildWebpackConfig(mode);
    startWebpackDevServer(webpackConfig, port, {
      contentBase: paths.outputPath,
      stats: { colors: true }
    });
  });

program.parse(process.argv);
