'use strict';

var _ = require('lodash');

// Select the correct DB config object for the current environment.
var env       = process.env.NODE_ENV || 'development';
var dbConfig  = require(__dirname + '/knexfile');
var knex      = require('knex')(dbConfig[env]);
var objection = require('objection');

// Give the connection to objection.
objection.Model.knex(knex);

// Add factory method to objection to create new Model classes.
objection.model = function(name, options) {

  // Create a constructor for Model.
  function ctor() {
    objection.Model.apply(this, arguments);
  }

  // Update ctor's name.
  Object.defineProperty(ctor, "name", { value: name });

  // Basic ES6 compatible prototypal inheritance.
  objection.Model.extend(ctor);

  // Assign all properties to new Model class.
  Object.keys(options || {}).forEach(function(key) {
    var property = options[key];
    if (typeof property === 'function')
      ctor.prototype[key] = property;
    else
      ctor[key] = property;
  });

  // Create a custom QueryBuilder for current Model.
  function qbCtor() {
    objection.QueryBuilder.apply(this, arguments);
  }

  // Basic ES6 compatible prototypal inheritance.
  objection.QueryBuilder.extend(qbCtor);

  qbCtor.forClass = function(modelClass) {
    var qb = objection.QueryBuilder.forClass.call(this, modelClass);

    var _eagerExp = '';
    var _eagerFilters = null;
    var _eagerMaxDepth = modelClass.defaultEagerMaxDepth || 2;
    var _eagerCurrentDepth = 0;
    var _eagerExpObject = {};

    console.log("Using max eager depth of " + _eagerMaxDepth + ".");

    function _traverseEagerExppression(model, prefix, additionalKey, depth) {
      // Recursion guard.
      if (depth > _eagerMaxDepth)
        return;

      var exp = model.defaultEager || null;
      var filters = model.defaultEagerFilters || null;
      var relations = model.getRelations() || {};
      var relNames = Object.keys(relations);

      if (_.isString(exp)) {
        // Removes square bracket for beginning and end of the string.
        exp = exp.replace(/^[\[]+|[\]]+$/g, "");

        // Split and clean up eager expression terms.
        var expTokens = exp
          .split(',')
          .map(function(str) {
            return str.trim();
          });

        // Add additional term from previous cycle to current expression.
        // An additional term is generated when in a default eager expression
        // terms like 'family,father.name' are used. In those cases, the
        // relation associated to the field 'family' is added at the first
        // step, while the additional term '.father.name' is passed to next
        // recursion step.
        // If the additional term is already present in the default eager
        // expression of the current model, don't duplicate it.
        if (additionalKey && expTokens.indexOf(additionalKey) == -1) {
          expTokens.push(additionalKey);
        }

        // Merge default eager filters from current recursion level with those
        // generated by previous recursion cycles.
        if (_.isObject(filters)) {
          _eagerFilters = _.merge(
            _eagerFilters,
            filters
          );
        }

        // For each term in default eager expression, follow the chain
        // if it represents a relation with another model (recursion).
        expTokens.forEach(function(key) {
          var _keyTokens = key.split('.');
          var _key = _keyTokens.pop()
          var _additionalKey = _keyTokens.slice(1).join('.');

          if (relNames.indexOf(_key) > -1) {
            var relatedModel = relations[_key].relatedModelClass;
            var _prefix = _key;
            _traverseEagerExppression(relatedModel, _prefix, _additionalKey, depth + 1);
          }
        });

        // Merge current expression terms with those generated by previous
        // recursion cycles. An object is used to store all of them in order
        // to eliminate overlapped or duplicated terms.
        expTokens.forEach(function(str) {
          var _key = str.trim();
          if (prefix) {
            // Prefix is used to keep track of relation chain.
            _key = prefix + '.' + _key;
          }
          if (!_.has(_eagerExpObject, _key)) {
            _.set(_eagerExpObject, _key);
          }
        });
      }
    }

    // Traverse default eager expression of current model, following
    // the relation chain and merging the results in one expression.
    _traverseEagerExppression(modelClass, '', null, 1);

    // Flatten the generated object in the final eager expression.
    function _flatten(obj) {
      var output = [];
      if (typeof obj === 'object') {
        Object
          .keys(obj)
          .forEach(function(key) {
            if (obj[key]) {
              if (Object.keys(obj[key]).length > 1) {
                output.push(key + '.[' + _flatten(obj[key]) + ']');
              } else {
                output.push(key + '.' + _flatten(obj[key]));
              }
            } else {
              output.push(key);
            }
          });
      }
      return output.join(', ');
    }

    _eagerExp = '[' + _flatten(_eagerExpObject) + ']';

    console.log("Default eager loading of " + _eagerExp + " for model " + modelClass.name);

    return qb.eager(_eagerExp, _eagerFilters);
  }

  ctor.QueryBuilder = qbCtor;
  ctor.RelatedQueryBuilder = qbCtor;

  return ctor;
}

module.exports = objection;
