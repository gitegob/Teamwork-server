/* eslint-disable no-unused-vars */
import { config } from 'dotenv';
import { Sequelize } from 'sequelize';
import log from './debug';

config();
const connectionString = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.DATABASE_URL;
const db = new Sequelize(connectionString, {
  logging: false,
});
const syncTables = async () => {
  log.db('Syncing tables...');
  await db.sync();
  await db.close();
  log.db('Synced tables.');
};
syncTables();
