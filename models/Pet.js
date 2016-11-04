'use strict';

var db = require('../db');

module.exports = db.model('Pet', {
  tableName: 'pet',
  defaultEager: '[race]',

	// Fields.
	jsonSchema: {
	},

  // Relations.
  relationMappings: {
    race: {
      relation: db.Model.BelongsToOneRelation,
      modelClass: __dirname + '/Race',
      join: {
        from: 'pet.race_id',
        to: 'race.id'
      }
    }
  },

	toString: function() {
		return this.name();
	}
});
