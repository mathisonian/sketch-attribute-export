var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports['default'] = function (context) {};

var writeNonConflictingFile = false; // TODO: Use plugin settings here

function saveJSON(obj, filePath) {
	obj = JSON.parse(JSON.stringify(obj));
	var data = NSJSONSerialization.dataWithJSONObject_options_error(obj, NSJSONWritingPrettyPrinted, nil),
	    dataAsString = NSString.alloc().initWithData_encoding(data, NSUTF8StringEncoding);
	return dataAsString.writeToFile_atomically_encoding_error(filePath, true, NSUTF8StringEncoding, nil);
}

function nameToId(str) {
	log('Converting ' + str + ' to ' + str.replace(/\s/g, '_'));
	return str.replace(/\s/g, '-');
}

function getClassFromName(name) {
	return name.split('.').slice(1).join(' ');
}

function buildNonConflictingPath(path) {
	var splitParts = path.split('\\').pop().split('/');
	var pathToFile = splitParts.slice(0, splitParts.length - 1).join('/');
	var filenameParts = splitParts.pop().split('.');
	var newFileName = filenameParts.slice(0, -2).concat([filenameParts[filenameParts.length - 2] + "_attribute_export", filenameParts[filenameParts.length - 1]]).join('.');
	return pathToFile + '/' + newFileName;
}

function onExportSlices(context) {
	var exp = context.actionContext.exports;
	var document = context.actionContext.document;

	var layerNames = [];
	var idCache = {};
	var handleLayer = function handleLayer(layer) {
		if (idCache[layer.name()]) {
			return;
		}
		idCache[layer.name()] = true;
		layerNames.push(layer.name());
		layer.children().forEach(function (c) {
			handleLayer(c);
		});
	};
	document.pages().forEach(function (page) {
		page.containedLayers().forEach(function (layer) {
			return handleLayer(layer);
		});
	});

	for (var i = 0; i < exp.count(); i++) {
		var currentExport = exp.objectAtIndex(i);
		if (currentExport.request.format() == 'svg') {

			var path = currentExport.path;
			var svgString = "" + NSString.stringWithContentsOfFile_encoding_error(path, NSUTF8StringEncoding, nil);

			layerNames.forEach(function (layerName) {
				var idString = nameToId(layerName);
				if (svgString.indexOf('id="' + idString + '"') > -1) {
					var className = getClassFromName(layerName);
					var newId = idString.replace(getClassFromName(layerName).split(' ').join('.'), '').replace('.', '');
					var replace = '';
					if (className) replace += 'class="' + className + '"';
					if (newId) replace += ' id="' + newId + '"';
					svgString = svgString.replace(new RegExp('id="' + idString + '"', 'g'), replace);
				}
			});

			svgString = svgString.replace(/svg width\=\"\d+px" height\=\"\d+px"/, 'svg ');

			var svgAsNsString = NSString.stringWithFormat("%@", svgString);
			if (writeNonConflictingFile) {
				svgAsNsString.writeToFile_atomically(buildNonConflictingPath(path), true);
			}
			svgAsNsString.writeToFile_atomically(path, true);
		}
	}
}

function run(context) {}

exports.run = run;
exports.onRun = run;
exports.onExportSlices = onExportSlices;
exports.exportSlices = onExportSlices;

/***/ })
/******/ ]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['default'] = __skpm_run.bind(this, 'default');
that['onExportSlices'] = __skpm_run.bind(this, 'onExportSlices');
that['onRun'] = __skpm_run.bind(this, 'default')
