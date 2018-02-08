exports.up = async function(knex, Promise) {
  await knex.raw('create extension if not exists "uuid-ossp"');
  return knex.schema.createTable("users", function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('username').notNullable();
    table.timestamps();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("users");
};
