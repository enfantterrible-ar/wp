const webpackConfigs = require('10up-toolkit/config/webpack.config');

module.exports = webpackConfigs.map((config) => {
	// Example: Add a plugin to each config
	// const SomeWebpackPlugin = require('some-webpack-plugin');
	// config.plugins = config.plugins || [];
	// config.plugins.push(new SomeWebpackPlugin());

	// Example: Extend module rules
	// config.module.rules.push({
	//   test: /\.txt$/,
	//   use: 'raw-loader',
	// });

	// Example: Add a resolve alias
	// config.resolve = config.resolve || {};
	// config.resolve.alias = {
	//   ...(config.resolve.alias || {}),
	//   '@components': path.resolve(__dirname, 'src/components'),
	// };

	return config;
});
