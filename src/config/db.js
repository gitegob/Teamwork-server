import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import * as helper from '../lib/helpers';
import log from './debug';

config();
const connectionString = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.DATABASE_URL;
const db = new Sequelize(connectionString, { logging: false });
export const dbTry = async (res, queryFn) => {
  try {
    return await queryFn;
  } catch (error) {
    log.error(error);
    return helper.sendError(res, 500, error);
  }
};

export const dbModel = {
  findOne: async (res, Model, where) => {
    const result = await dbTry(res,
      Model.findOne({ where }));
    return result;
  },
  findAll: async (res, Model, conditions) => {
    const result = await dbTry(res,
      Model.findAll(conditions));
    return result;
  },
  create: async (res, Model, data) => {
    const result = await dbTry(res,
      Model.create(data));
    return result;
  },
  update: async (res, instance, data) => {
    const result = await dbTry(res,
      instance.update(data));
    return result;
  },
  delete: async (res, instance, conditions) => {
    const result = await dbTry(res,
      instance.destroy(conditions));
    return result;
  },
};

export const testDB = async (app) => {
  if (app.get('env') !== 'test') {
    try {
      await db.authenticate();
      return log.db('Database Connected...');
    } catch (error) {
      return log.error('Error:', error);
    }
  } return null;
};

export default db;
