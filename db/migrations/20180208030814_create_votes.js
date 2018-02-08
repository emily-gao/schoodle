exports.up = async function(knex, Promise) {
  await knex.raw('create extension if not exists "uuid-ossp"');
  return knex.schema.createTable("votes", function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.boolean('isOK').defaultTo(false).notNullable();
    table.uuid('user_id').notNullable().references('users.id');
    table.uuid('event_option_id').notNullable().references('event_options.id');
    table.unique(['user_id', 'event_option_id']);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("votes");
};