
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('person').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('person').insert({id: 1, name: 'Bob'}),
        knex('person').insert({id: 2, name: 'Jennifer'}),
        knex('person').insert({id: 3, name: 'Luke'})
      ]);
    });
};
