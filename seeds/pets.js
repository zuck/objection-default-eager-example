
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('pet').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('pet').insert({
          id: 1,
          name: 'Fuffy',
          race_id: 2,
          owner_id: 1
        }),
        knex('pet').insert({
          id: 2,
          name: 'Bobby',
          race_id: 1,
          owner_id: 2
        }),
        knex('pet').insert({
          id: 3,
          name: 'Doggy',
          race_id: 1,
          owner_id: 2
        }),
        knex('pet').insert({
          id: 4,
          name: 'Dart',
          race_id: 3,
          owner_id: 2
        }),
        knex('pet').insert({
          id: 5,
          name: 'Tweety',
          race_id: 3,
          owner_id: 3
        }),
        knex('pet').insert({
          id: 6,
          name: 'Sylvester',
          race_id: 2,
          owner_id: 3
        })
      ]);
    });
};
