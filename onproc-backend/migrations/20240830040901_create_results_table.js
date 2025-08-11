/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('results', (table) => {
        table.uuid('id').primary(); // UUID as primary key
        table.uuid('jobid').references('id').inTable('jobs'); // Reference to jobs table
        table.string('workspace'); // Workspace column
        table.string('layer'); // Layer column
        table.timestamps(true, true); // Created at and updated at timestamps
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('results'); // Drop the results table
};
