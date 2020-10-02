import { DataTypes } from 'sequelize';
import db from '../config/db';
import Article from './Article';
import User from './User';

const Comment = db.define('comment', {
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Article,
      key: 'id',
    },
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  updatedAt: false,
  createdAt: 'postedAt',
});
export default Comment;
