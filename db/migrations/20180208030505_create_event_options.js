exports.up = async function(knex, Promise) {
  await knex.raw('create extension if not exists "uuid-ossp"');
  return knex.schema.createTable("event_options", function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('event_id').notNullable().references('events.id');
    table.text('option').notNullable();
    table.timestamps();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("event_options");
};