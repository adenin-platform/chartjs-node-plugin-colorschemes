# chartjs-node-plugin-colorschemes

This is a nodejs compatible fork of [chartjs-plugin-colorschemes](https://github.com/nagix/chartjs-plugin-colorschemes), which basically just converts the ES6 modules to CommonJS modules, and changes the API somewhat, so that it can be used server-side with packages like [chartjs-node](https://www.npmjs.com/package/chartjs-node).

## Usage

To register the plugin to chartjs-node, use the following:

```js
const colorschemes = require('chartjs-plugin-colorschemes');

const chart = new ChartjsNode(parsed.dimensions.width, parsed.dimensions.height);

chart.on('beforeDraw', (instance) => {
    colorschemes(instance);
});
```

You can then pass the desired color scheme in the chartjs configuration like so:

```json
{
    "options": {
        "plugins": {
            "colorschemes": {
                "scheme": "brewer.Spectral11"
            }
        }
    }
}
```

See the [chartjs-plugin-colorschemes website](https://nagix.github.io/chartjs-plugin-colorschemes/) for more usage information and a list of available color schemes.

## License

chartjs-plugin-colorschemes is available under the [MIT license](https://opensource.org/licenses/MIT).
