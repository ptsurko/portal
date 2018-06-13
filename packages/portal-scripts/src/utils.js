const fs = require('fs');
const path = require('path');
const paths = require('./paths');

const MODE_DEVELOPMENT = 'development';
const MODE_PRODUCTION = 'production';

const DEFAULT_CONTAINER_PORT = 3000;
const DEFAULT_CONTAINER_ENTRY = 'src/index.js';

const DEFAULT_APP_NAME = 'DEFAULT_APP';
const DEFAULT_APP_ENTRY = 'src/index.js';
const DEFAULT_APP_PORT = 3001;

const APP_LIST_LOCAL = 'apps.local.json';
const APP_LIST_DEV = 'apps.dev.json';

const APPS_FILES_PRIORITY = [APP_LIST_LOCAL, APP_LIST_DEV];

const defaultAppSettings = {
  appName: DEFAULT_APP_NAME,
  entry: DEFAULT_APP_ENTRY,
  port: DEFAULT_APP_PORT,
};

const defaultContainerSettings = {
  port: DEFAULT_CONTAINER_PORT,
  entry: DEFAULT_CONTAINER_ENTRY,
};

const loadAppSettings = () => {
  const packageJson = JSON.parse(fs.readFileSync(paths.packageJsonPath, 'utf8'));

  const appSettings = {
    ...defaultAppSettings,
    ...packageJson.portalApp,
    appName: packageJson.name || DEFAULT_APP_NAME,
  };

  return appSettings;
};

const loadContainerSettings = () => {
  return {
    ...defaultContainerSettings,
  };
}

const loadCustomWebpackConfig = () => {
  if (!fs.existsSync(paths.webpackConfigPath)) {
    return null;
  }

  return require(paths.webpackConfigPath);
}

const loadListOfApps = () => {
  return APPS_FILES_PRIORITY
    .reverse()
    .map((fileName) => {
      if (fileName === APP_LIST_LOCAL) {
        console.log('Local apps file detected. Loading...');
      }

      const filePath = path.join(paths.workingDir, fileName);
      if (!fs.existsSync(filePath)) {
        return null;
      }

      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (e) {
        console.error(`Unable to parse apps file ${fileName}: `, e);
        return {};
      }
    })
    .filter(Boolean)
    .reduce((result, data) => {
      return {
        ...result,
        ...data
      };
    }, {});
}

const mergeWebpackConfigs = (defaultConfig, customConfig, mode) => {
  if (customConfig === null) {
    return defaultConfig;
  }

  if (typeof customConfig === "function") {
    return customConfig(defaultConfig, mode);
  }

  return customConfig;
};

module.exports = {
  MODE_DEVELOPMENT,
  MODE_PRODUCTION,
  mergeWebpackConfigs,
  loadAppSettings,
  loadContainerSettings,
  loadCustomWebpackConfig,
  loadListOfApps,
};
