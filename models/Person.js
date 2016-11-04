'use strict';

var db = require('../db');

module.exports = db.model('Person', {
  tableName: 'person',
  defaultEager: '[pets]',
  virtualAttributes: ['petAddicted'],

	// Fields.
	jsonSchema: {
	},

  // Relations.
  relationMappings: {
    pets: {
      relation: db.Model.HasManyRelation,
      modelClass: __dirname + '/Pet',
      join: {
        from: 'person.id',
        to: 'pet.owner_id'
      }
    }
  },

	toString: function() {
		return this.name();
	},
  petAddicted: function() {
    return this.pets.length;
  }
});
