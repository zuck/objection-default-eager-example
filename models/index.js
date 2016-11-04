'use strict';

var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(module.filename);

// Register all models in the central registry.
var modelRegistry = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file !== 'db.js') && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var modelClass = require(path.join(__dirname, file));
    if (modelClass)
      modelRegistry[modelClass.name] = modelClass;
  });

// Export the model registry.
module.exports = modelRegistry;
