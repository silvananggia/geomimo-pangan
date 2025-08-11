// knexfile.js

require('dotenv').config(); // Ensure you have dotenv installed

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost', // Added host from environment
      database: process.env.DB_NAME || 'onproc',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  

};
