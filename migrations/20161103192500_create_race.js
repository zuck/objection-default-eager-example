exports.up = function(knex, Promise) {
  return knex.schema.createTable('race', function(t) {
    t.increments('id').unsigned().primary();
    t.string('name').notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('race');
};
