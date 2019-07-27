'use strict';
var path = require('path');
var webpack = require('webpack');

var cache = {};
var loaders = [
	{
		test: /\.js$/,
		loader: 'babel-loader',
        exclude: /node_modules/
	},
];
var extensions = [
	'.js', '.es6.js'
];

module.exports = [{
	cache: cache,
	module: {
		rules: loaders
	},
	entry: {
		main: './src/usm',
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: 'usm.js',
		sourceMapFilename: "[file].map",
	},
	resolve: {
		modules: [
			__dirname,
			path.resolve(__dirname, "src"),
			"node_modules"
		],
		extensions: extensions
	},
}];
