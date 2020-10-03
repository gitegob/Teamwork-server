import { DataTypes } from 'sequelize';
import db from '../config/db';
import Article from './Article';
import User from './User';

const Comment = db.define('comment', {
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  updatedAt: false,
  createdAt: 'postedAt',
});

Comment.belongsTo(User, { as: 'author', onDelete: 'cascade' });
Comment.belongsTo(Article, { onDelete: 'cascade' });

export default Comment;
