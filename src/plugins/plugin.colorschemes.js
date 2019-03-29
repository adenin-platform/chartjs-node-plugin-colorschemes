'use strict';

const colorschemes = require('../colorschemes/index');

module.exports = (Chart) => {
  const helpers = Chart.helpers;

  // Element models are always reset when hovering in Chart.js 2.7.2 or earlier
  const hoverReset = Chart.DatasetController.prototype.removeHoverStyle.length === 2;

  Chart.defaults.global.plugins.colorschemes = {
    scheme: 'brewer.Paired12',
    fillAlpha: 0.5,
    reverse: false
  };

  return {
    id: 'colorschemes',

    beforeUpdate: function (chart, options) {
      const s = options.scheme.split('.');
      const category = colorschemes[s[0]];
      let scheme; let length; let colorIndex; let color;

      if (category) {
        scheme = category[s[1]];
        length = scheme.length;
        if (scheme) {
          // Set scheme colors
          chart.config.data.datasets.forEach((dataset, datasetIndex) => {
            colorIndex = datasetIndex % length;
            color = scheme[options.reverse ? length - colorIndex - 1 : colorIndex];

            // Object to store which color option is set
            dataset.colorschemes = {};

            switch (dataset.type || chart.config.type) {
            // For line, radar and scatter chart, borderColor and backgroundColor (50% transparent) are set
            case 'line':
            case 'radar':
            case 'scatter':
              if (typeof dataset.backgroundColor === 'undefined') {
                dataset.backgroundColor = helpers.color(color).alpha(options.fillAlpha).rgbString();
                dataset.colorschemes.backgroundColor = true;
              }
              if (typeof dataset.borderColor === 'undefined') {
                dataset.borderColor = color;
                dataset.colorschemes.borderColor = true;
              }
              if (typeof dataset.pointBackgroundColor === 'undefined') {
                dataset.pointBackgroundColor = helpers.color(color).alpha(options.fillAlpha).rgbString();
                dataset.colorschemes.pointBackgroundColor = true;
              }
              if (typeof dataset.pointBorderColor === 'undefined') {
                dataset.pointBorderColor = color;
                dataset.colorschemes.pointBorderColor = true;
              }
              break;
            // For doughnut and pie chart, backgroundColor is set to an array of colors
            case 'doughnut':
            case 'pie':
              if (typeof dataset.backgroundColor === 'undefined') {
                dataset.backgroundColor = dataset.data.map((data, dataIndex) => {
                  colorIndex = dataIndex % length;
                  return scheme[options.reverse ? length - colorIndex - 1 : colorIndex];
                });
                dataset.colorschemes.backgroundColor = true;
              }
              break;
            case 'radialGauge': {
              const gradient = chart.ctx.createLinearGradient(0, 100, 170, 0);

              gradient.addColorStop(0, color);
              gradient.addColorStop(1, scheme[options.reverse ? length - colorIndex + 2 : colorIndex + 2]);

              dataset.backgroundColor = gradient;
              dataset.colorschemes.backgroundColor = true;

              break;
            }
            // For the other chart, only backgroundColor is set
            default:
              if (typeof dataset.backgroundColor === 'undefined') {
                dataset.backgroundColor = color;
                dataset.colorschemes.backgroundColor = true;
              }
              break;
            }
          });
        }
      }
      return true;
    },

    afterUpdate: function (chart) {
      // Unset colors
      chart.config.data.datasets.forEach((dataset) => {
        if (dataset.colorschemes) {
          if (dataset.colorschemes.backgroundColor) {
            delete dataset.backgroundColor;
          }
          if (dataset.colorschemes.borderColor) {
            delete dataset.borderColor;
          }
          if (dataset.colorschemes.pointBackgroundColor) {
            delete dataset.pointBackgroundColor;
          }
          if (dataset.colorschemes.pointBorderColor) {
            delete dataset.pointBorderColor;
          }
          delete dataset.colorschemes;
        }
      });
    },

    beforeEvent: function (chart, event, options) {
      if (hoverReset) {
        this.beforeUpdate(chart, options);
      }
      return true;
    },

    afterEvent: function (chart) {
      if (hoverReset) {
        this.afterUpdate(chart);
      }
    }
  };
};
