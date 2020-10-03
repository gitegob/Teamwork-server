/* eslint-disable no-param-reassign */
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../config/db';
import User from './User';

const Password = db.define('password', {
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  hooks: {
    beforeCreate: (password) => {
      password.password = bcrypt.hashSync(password.password, 10);
    },
  },
});

Password.belongsTo(User, { onDelete: 'cascade' });
export default Password;
