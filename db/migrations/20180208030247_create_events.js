exports.up = async function(knex, Promise) {
  await knex.raw('create extension if not exists "uuid-ossp"');
  return knex.schema.createTable("events", function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('url').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('event_name').notNullable();
    table.text('description');
    table.text('value_type').defaultTo('date').notNullable();
    table.uuid('organizer_id').notNullable().references('users.id');
    table.timestamps();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("events");
};
