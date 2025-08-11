/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('jobs', function(table) {
      table.uuid('id').primary(); // Auto-incrementing ID
      table.string('username').notNullable(); // Foreign key to the users table
      table.string('job_name').notNullable(); // Name of the job
      table.text('command').notNullable(); // Command to be executed
      table.string('status').notNullable().defaultTo('queued'); // Job status
      table.integer('cpu_required').notNullable(); // CPU cores required
      table.integer('priority').notNullable(); // Job priority
      table.integer('progress').defaultTo(0); // Progress percentage
      table.timestamp('time_start').nullable(); // Start time of the job
      table.timestamp('time_finish').nullable(); // Finish time of the job
      table.timestamps(true, true); // Created at and updated at timestamps
    });
  };


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
  
exports.down = function(knex) {
    return knex.schema.dropTable('jobs');
  };
