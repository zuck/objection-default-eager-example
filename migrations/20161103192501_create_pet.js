exports.up = function(knex, Promise) {
  return knex.schema.createTable('pet', function(t) {
    t.increments('id').unsigned().primary();
    t.string('name').notNull();
    t.integer('race_id').notNull().defaultTo(0);
    t.integer('owner_id').nullable().defaultTo(null);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('pet');
};
