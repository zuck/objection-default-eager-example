
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('race').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('race').insert({id: 1, name: 'dog'}),
        knex('race').insert({id: 2, name: 'cat'}),
        knex('race').insert({id: 3, name: 'bird'})
      ]);
    });
};
