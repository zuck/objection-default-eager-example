'use strict';

var db = require('../db');

module.exports = db.model('Race', {
  tableName: 'race',
  defaultEager: '[pets]',

	// Fields.
	jsonSchema: {
	},

  // Relations.
  relationMappings: {
    pets: {
      relation: db.Model.HasManyRelation,
      modelClass: __dirname + '/Pet',
      join: {
        from: 'race.id',
        to: 'pet.race_id'
      }
    }
  },

	toString: function() {
		return this.name();
	}
});
