import { DataTypes } from 'sequelize';
import db from '../config/db';
import Comment from './Comment';
import User from './User';

const CommentFlag = db.define('comment_flag', {
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Comment,
      key: 'id',
    },
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  updatedAt: false,
});
export default CommentFlag;
