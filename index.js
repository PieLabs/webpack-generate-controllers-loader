var _ = require('lodash')
var async = require('async');
var path = require('path');
var utils = require('loader-utils');
var upperCamelCase = require('uppercamelcase')
var debug = require('debug')('loader/generate-controllers-loader');

//use it like so
//import controllersMap from 'babel-loader?presets[]=es2015!generate-controllers-loader!./item.json';

module.exports = function(source){
  var callback = this.async();
  generateControllersFromItem(this, source, function(err, result) {
    if(err) return callback(err);
    callback(null, result);
  });
};

function generateControllersFromItem(loader, source, mainCallback) {
  var item = eval(source);
  var compNames = _.chain(item.components).map(function (c) {
    return c.component.name
  }).uniq().value();

  var data = {
    imports: [],
    entries: []
  }
  async.eachSeries(compNames, compToData, prepareResults);

  //---------------------------------

  function compToData(comp, callback) {
    async.waterfall([
      initData,
      resolvePackage,
      getPackageContent,
      getImportPath,
      addData
    ], callback);

    function initData(callback){
      callback(null, {comp: comp});
    }

    function resolvePackage(o, callback){
      var pathToResolve = path.join(comp, 'package.json');
      loader.resolve(loader.context, pathToResolve, function (err, res) {
        if(!err){
          o.package = res
        }
        callback(err, o);
      });
    }

    function getPackageContent(o, callback) {
      try {
        o.packageContent = require(o.package);
      } catch (e) {
        o.packageContent = {};
      }
      callback(null, o);
    }

    function getImportPath(o, callback){
      if(loader.options.generateControllersLoader &&
        loader.options.generateControllersLoader.pieControllers &&
        loader.options.generateControllersLoader.pieControllers[o.comp]){
        o.importPath = loader.options.generateControllersLoader.pieControllers[o.comp];
      } else if (o.packageContent.controller) {
        o.importPath = path.join(o.comp, o.packageContent.controller);
      } else {
        o.importPath = path.join(o.comp, 'controller');
      }
      callback(null, o);
    }

    function addData(o, callback){
      data.imports.push(toImport(o));
      data.entries.push(toMapEntry(o));
      callback();
    }
  }

  function prepareResults(err, res) {
    var lines = [];

    function writeln(s) {
      lines.push(s);
    }

    function writelnWithComma(s) {
      lines.push(s + ',');
    }

    var imports = data.imports;
    var entries = data.entries;
    var lastEntry = entries.pop();

    _.forEach(imports, writeln);
    writeln('export default {');
    _.forEach(entries, writelnWithComma);
    writeln(lastEntry);
    writeln('}');

    mainCallback(err, lines.join('\n'));
  }
}

function toImport(o){
  return 'import {Controller as ' + toControllerName(o) + '} from \'' + o.importPath +'\';';
}

function toMapEntry(o){
  return '\t"' + o.comp + '": new ' + toControllerName(o) + '()';
}

function toControllerName(o){
  return toClassName(o.comp) + 'Controller';
}

function toClassName(name){
  if(_.isString(name)) {
    return upperCamelCase(name)
  } else {
    throw new Error("Argument exception: String expected");
  }
}

