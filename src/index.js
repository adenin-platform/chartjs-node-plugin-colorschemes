'use strict';

module.exports = (instance) => {
  const colorSchemesPlugin = require('./plugins/plugin.colorschemes')(instance);
  const colorschemes = require('./colorschemes/index');

  instance.colorschemes = colorschemes;
  instance.plugins.register(colorSchemesPlugin);
};
