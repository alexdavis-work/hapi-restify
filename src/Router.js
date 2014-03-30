var _ = require('lodash'),
		fs = require('fs');

/**
 * Router
 * Create routes mapped
 * to model/controllers
 * @type {Function}
 */
var Router = module.exports = function Router(modelPath, controllerPath) {
	this.modelPath = modelPath;
	this.controllerPath = controllerPath;
};

_.extend(
	Router.prototype,
	{
		/**
		 * Walk directories to find
		 * controllers & models
		 * @param callback {Function}
		 */
		searchModules: function (callback) {
			var self = this;
			this.findModels(
				function () {
					self.findControllers(
						function () {
							if (!self.controllers.index) {
								self.addIndexController();
							}
							callback();
						}
					);
				}
			);
		},

		/**
		 * Walk the model directory
		 * @param callback {Function}
		 */
		findModels: function (callback) {
			this.walkDir(
				'models',
				this.modelPath,
				function(path, file, array) {
					array[file] = require(path);
				},
				callback
			);
		},

		/**
		 * Walk the controller directory
		 * @param callback {Function}
		 */
		findControllers: function (callback) {
			this.walkDir(
				'controllers',
				this.controllerPath,
				function(path, file, array) {
					array[file] = require(path);
				},
				callback
			);
		},

		/**
		 * Add the default "ping"
		 * Index controller
		 */
		addIndexController: function () {
			console.log('Registering controllers: "index"');
			this.controllers.index = require(
				'./Controller/Index'
			);
		},

		/**
		 * Walk a directory & read files
		 * @param type {String}
		 * @dir type {String}
		 * @processFn type {Function}
		 * @callback type {Function}
		 */
		walkDir: function(type, dir, processFn, callback) {
			var self = this;
			this[type] = {};
			fs.readdir(dir, function (err, files) {
				files.forEach(function (file) {
					if (file[0] !== '.') {
						var fileName = file.replace('.js', '');
						console.log('Registering ' + type + ': "' + fileName + '"');
						self[type][fileName] = dir + '/' + file;
					}
				});
				if (typeof processFn === 'function') {
					_.each(self[type], processFn);
				}
				callback();
			});
		}
	}
);
